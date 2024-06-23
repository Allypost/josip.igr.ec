import type { Element, Nodes, Properties, Root } from "hast";
import { h as hRaw } from "hastscript";
import type { Plugin } from "unified";
import type { Node as UNode, Parent as UParent } from "unist";

type PrimitiveChild = number | string | null | undefined;
type ArrayChild = (ArrayChildNested | Nodes | PrimitiveChild)[];
type ArrayChildNested = (Nodes | PrimitiveChild)[];
type Child = ArrayChild | Nodes | PrimitiveChild;

function h(selector: null | undefined, ...children: Child[]): Root;
function h(
  selector: string,
  properties: Properties,
  ...children: Child[]
): Element;
function h(selector: string, ...children: Child[]): Element;
function h(
  selector: string | null | undefined,
  properties?: Properties | Child,
  ...args: Child[]
) {
  // @ts-expect-error plugin is wonky
  return hRaw(selector, properties, ...args) as Element | Root;
}

let GLOBAL_COUNT = 1;

const visitElements = async <N extends UNode>(
  node: N,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
  cb: (el: Element, elIndex?: number, parent?: UParent) => Promise<any> | any,
) => {
  const visit = async (node: UNode, nodeIndex?: number, parent?: UParent) => {
    if (node.type === "element") {
      const n = node as unknown as Element;

      await cb(n, nodeIndex, parent);
    }

    if (!("children" in node)) {
      return;
    }

    const p = node as UParent;

    await Promise.all(p.children.map((c, idx) => visit(c, idx, p)));
  };

  await visit(node);
};

export const rehypeImagesInFigures: Plugin<[], Root> = () => {
  return async (tree) => {
    await visitElements(tree, (el, elIndexInParent, parent) => {
      if (el.tagName !== "img") {
        return;
      }

      if (!parent || typeof elIndexInParent !== "number") {
        return;
      }

      const { src, alt, ...imgProps } = el.properties;

      if (typeof src !== "string" || !src) {
        return;
      }

      const figId = `_fig-${Math.random().toString(36).slice(2)}${GLOBAL_COUNT++}`;
      const shouldRenderFigCaption = typeof alt === "string";

      const figureChildren = [
        h("img", {
          ...imgProps,
          alt,
          loading: "lazy",
          decoding: "async",
          quality: "90",
          src,
        }),
      ];

      if (shouldRenderFigCaption) {
        figureChildren.push(
          h(
            "figcaption",
            {
              id: `${figId}-caption`,
            },
            alt,
          ),
        );
      }

      const figure = h("figure", {}, ...figureChildren);

      // Replace the image node with the figure
      parent.children.splice(elIndexInParent, 1, figure);
    });
  };
};

export default rehypeImagesInFigures;

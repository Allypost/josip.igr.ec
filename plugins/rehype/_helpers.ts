import type { Element, Nodes, Properties, Root } from "hast";
import { h as hRaw } from "hastscript";
import type { Node as UNode, Parent as UParent } from "unist";

type PrimitiveChild = number | string | null | undefined;
type ArrayChild = (ArrayChildNested | Nodes | PrimitiveChild)[];
type ArrayChildNested = (Nodes | PrimitiveChild)[];
type Child = ArrayChild | Nodes | PrimitiveChild;

export function h(selector: null | undefined, ...children: Child[]): Root;
export function h(
  selector: string,
  properties: Properties,
  ...children: Child[]
): Element;
export function h(selector: string, ...children: Child[]): Element;
export function h(
  selector: string | null | undefined,
  properties?: Properties | Child,
  ...args: Child[]
) {
  // @ts-expect-error plugin is wonky
  return hRaw(selector, properties, ...args);
}

export const visitElements = async <N extends UNode>(
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

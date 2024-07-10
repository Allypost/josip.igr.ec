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

type MaybePromise<T> = T | Promise<T>;

export const visitNodes = async <N extends UNode>(
  node: N,
  cb: (
    node: UNode,
    nodeIndex?: number,
    parent?: UParent,
  ) => MaybePromise<unknown>,
) => {
  const visit = async (node: UNode, nodeIndex?: number, parent?: UParent) => {
    await cb(node, nodeIndex, parent);

    if (!("children" in node)) {
      return;
    }

    const p = node as UParent;

    await Promise.all(p.children.map((c, idx) => visit(c, idx, p)));
  };

  await visit(node);
};

export const visitElements = async <N extends UNode>(
  node: N,
  cb: (
    el: Element,
    elIndex?: number,
    parent?: UParent,
  ) => MaybePromise<unknown>,
) => {
  await visitNodes(node, async (n, idx, p) => {
    if (n.type !== "element") {
      return;
    }

    const el = n as Element;
    await cb(el, idx, p);
  });
};

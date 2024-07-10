import type { Root } from "hast";
import type { Plugin } from "unified";
import { h } from "./_helpers";

type NodeAction =
  | {
      action: "delete";
    }
  | {
      action: "wrap";
      nodeName: string;
    };

const typeHandlers: {
  [K in Root["children"][number]["type"]]?: (
    node: Extract<Root["children"][number], { type: K }>,
    index: number,
  ) => NodeAction | null;
} = {
  text: (node) => {
    if (node.value.trim()) {
      return null;
    }

    return {
      action: "delete",
    };
  },
  element: (child) => {
    if (child.tagName === "p") {
      return null;
    }

    if (child.tagName === "div") {
      return null;
    }

    // Matches `<h1>` to `<h6>`
    if (child.tagName[0] === "h" && child.tagName.length === 2) {
      return null;
    }

    return {
      action: "wrap",
      nodeName: "div",
    };
  },
};

export const rehypeWrapRootElementsInContainers: Plugin<[], Root> = () => {
  return (tree) => {
    const deleteIdxs = [] as number[];
    for (const [i, child] of tree.children.entries()) {
      const handler = typeHandlers[child.type];
      const action = handler?.(child as never, i);

      switch (action?.action) {
        case "delete": {
          deleteIdxs.push(i);
          break;
        }

        case "wrap": {
          delete child.position;
          tree.children[i] = h(action.nodeName, child);
          break;
        }
      }
    }

    for (const i of deleteIdxs.reverse()) {
      tree.children.splice(i, 1);
    }
  };
};

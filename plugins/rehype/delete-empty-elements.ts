import type { Root, Element } from "hast";
import type { Plugin } from "unified";

import { visitElements } from "./_helpers";

export const rehypeDeleteEmptyElements: Plugin<[], Root> = () => {
  return async (tree) => {
    await visitElements(tree, (el, elIdxInParent, parent) => {
      if (!parent || typeof elIdxInParent !== "number") {
        return;
      }

      const p = parent as Element;

      if (!p.tagName) {
        return;
      }

      switch (el.tagName) {
        case "code": {
          if (p.tagName !== "pre") {
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          while (true) {
            const lastEl = el.children[el.children.length - 1];
            if (!lastEl) {
              break;
            }

            if (lastEl.type === "text" && !lastEl.value.trim()) {
              el.children.pop();
              continue;
            }

            if (lastEl.type === "element" && !lastEl.children.length) {
              el.children.pop();
              continue;
            }

            break;
          }
        }
      }
    });
  };
};

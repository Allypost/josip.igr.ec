import type { Root } from "hast";
import type { Plugin } from "unified";

import { visitElements } from "./_helpers";

export const rehypeRemoteLinksGetTarget: Plugin<[], Root> = () => {
  return async (tree) => {
    await visitElements(tree, (el, elIndexInParent, parent) => {
      if (el.tagName !== "a") {
        return;
      }

      if (!parent || typeof elIndexInParent !== "number") {
        return;
      }

      const { href } = el.properties;

      if (typeof href !== "string" || !href) {
        return;
      }

      if (href.match(/^https?:\/\//)) {
        el.properties.target = "_blank";
        el.properties.rel = "noopener noreferrer";
      }
    });
  };
};

export default rehypeRemoteLinksGetTarget;

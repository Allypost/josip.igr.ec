import type { Root } from "hast";
import type { Plugin } from "unified";

import { h, visitElements } from "./_helpers";

let GLOBAL_COUNT = 1;

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

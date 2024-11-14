import type { Element, ElementContent } from "hast";
import { is } from "unist-util-is";
import type { Root } from "hast";
import type { Plugin } from "unified";

export const rehypeWrapParagraphWithTextIntoSections: Plugin<[], Root> =
  () => (tree) => {
    const newChildren = [] as Element[];

    let currentSection = {
      type: "element",
      tagName: "section",
      properties: {},
      children: [],
    } as Element;

    // Suck up all nodes before the first heading
    let i = 0;
    for (; i < tree.children.length; i++) {
      const node = tree.children[i];

      if (is(node, "element")) {
        break;
      }

      currentSection.children.push(node as never);
    }

    // Now start walking the tree and adding sections as we find headings
    for (; i < tree.children.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const node = tree.children[i]!;

      if (is(node, "element") && /^h(\d+)$/.test(node.tagName)) {
        {
          const [mdx, nonMdx] = currentSection.children.reduce((acc, el) => {
            if (el.type.startsWith("mdxjs")) {
              acc[0].push(el);
              return acc;
            }

            acc[1].push(el);
            return acc;
          }, [[] as ElementContent[], [] as ElementContent[]]);
          // Ignore MDX stuff for sections
          currentSection.children = nonMdx;
          // Add MDX stuff directly to children
          newChildren.push(...mdx as never[]);
        }

        // If a heading is found, push the current section and start a new one
        if (currentSection.children.length > 0) {
          newChildren.push(currentSection);
        }

        currentSection = {
          type: "element",
          tagName: "section",
          properties: {},
          children: [node], // Start the new section with the heading
        };
      } else {
        // If we're in a section, add the node to the current section
        currentSection.children.push(node as never);
      }
    }

    // Add the last section if it has any nodes
    if (currentSection.children.length > 0) {
      newChildren.push(currentSection);
    }

    // Replace the original children with our modified list
    tree.children = newChildren;
  };

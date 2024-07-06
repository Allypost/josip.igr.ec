import type { RemarkPlugin } from "@astrojs/markdown-remark";
import type {
  BlockContent,
  DefinitionContent,
  PhrasingContent,
  ListItem,
} from "mdast";
import { toc as generateTocElements } from "mdast-util-toc";

export type Heading = {
  text: string;
  href: string;
  subheadings: Heading[];
};

export const remarkAddToc = (() => {
  return (tree, { data }) => {
    const visit = (
      node: BlockContent | DefinitionContent | PhrasingContent | ListItem,
      parentHeading?: Heading,
    ) => {
      let heading: Heading | undefined;

      if (node.type === "listItem") {
        const childParagraph = node.children[0];
        if (childParagraph?.type === "paragraph") {
          const childLink = childParagraph.children[0];
          if (childLink?.type === "link") {
            const childText = childLink.children[0];
            if (childText?.type === "text") {
              heading = {
                text: childText.value,
                href: childLink.url,
                subheadings: [],
              };
            }
          }
        }
      }

      if (heading) {
        parentHeading?.subheadings.push(heading);
      }

      const dDepth = heading !== undefined ? 1 : 0;
      if ("children" in node && node.children.length > dDepth) {
        node.children
          .slice(dDepth)
          .forEach((n) => visit(n as never, heading ?? parentHeading));
      }

      return heading;
    };

    const res = generateTocElements(tree, {
      ordered: true,
      tight: true,
    }).map;

    const astroData = data.astro as {
      frontmatter: {
        generatedHeadings: Heading[];
      };
    };
    astroData.frontmatter.generatedHeadings = [];

    if (res) {
      astroData.frontmatter.generatedHeadings = res.children
        .map((x) => visit(x))
        .filter(Boolean);
    }
  };
}) satisfies RemarkPlugin;

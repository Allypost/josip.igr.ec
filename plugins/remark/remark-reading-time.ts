import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export const remarkReadingTime = (() => {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);

    const astroData = data.astro as {
      frontmatter: {
        minutesRead: string;
        wordsOnPage: number;
      };
    };

    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    astroData.frontmatter.minutesRead = readingTime.text;
    astroData.frontmatter.wordsOnPage = textOnPage.split(" ").length;
  };
}) satisfies RemarkPlugin;

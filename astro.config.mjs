import "dotenv/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import playformCompress from "@playform/compress";
import { defineConfig, squooshImageService } from "astro/config";
import icon from "astro-icon";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRemoveComments from "rehype-remove-comments";
import rehypeRewrite from "rehype-rewrite";
import rehypeSlug from "rehype-slug";
import remarkCodeTitles from "remark-flexible-code-titles";
import remarkToc from "remark-toc";

import rehypeImagesInFigures from "./plugins/rehype/images-in-figures";
import rehypeRemoteLinksGetTarget from "./plugins/rehype/remote-links-get-target";
import { remarkReadingTime } from "./plugins/remark/remark-reading-time";

// https://astro.build/config
export default defineConfig({
  // eslint-disable-next-line no-undef
  site: process.env.PUBLIC_SITE_URL ?? "https://josip.igr.ec",
  image: {
    service: squooshImageService(),
  },
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
    icon(),
    playformCompress({
      CSS: {
        lightningcss: {
          minify: true,
          errorRecovery: true,
          analyzeDependencies: true,
        },
      },
      Image: false,
    }),
  ],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "aurora-x",
      },
    },
    remarkPlugins: [
      remarkReadingTime,
      [
        remarkCodeTitles,
        {
          containerTagName: "section",
          containerClassName: "code-container",
          /**
           *
           * @param {string|undefined} lanugage
           * @param {string|undefined} title
           */
          containerProperties: (lanugage, title) => ({
            title,
            "data-language": lanugage,
          }),
          titleTagName: "h6",
          titleClassName: "code-title",
          tokenForSpaceInTitle: "¤",
        },
      ],
      remarkToc,
    ],
    rehypePlugins: [
      rehypeAccessibleEmojis,
      rehypeImagesInFigures,
      rehypeRemoteLinksGetTarget,
      rehypeRemoveComments,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
        },
      ],
      [
        rehypeRewrite,
        {
          /**
           * @type {import("rehype-rewrite").RehypeRewriteOptions["rewrite"]}
           */
          rewrite: (node, _index, _parent) => {
            if (node.type === "element") {
              const style = node.properties.style;
              if (typeof style === "string") {
                node.properties.style = style
                  .replaceAll("--shiki-", "--")
                  .replaceAll("--dark:", "--dark-color:");
              }

              if (node.tagName === "pre") {
                if (Array.isArray(node.properties.className)) {
                  if (node.properties.className.includes("astro-code")) {
                    node.properties.className = ["code-contents"];
                  }
                }

                delete node.properties.tabIndex;
              }
            }
          },
        },
      ],
    ],
  },
  build: {
    inlineStylesheets: "always",
    assets: "_static",
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});

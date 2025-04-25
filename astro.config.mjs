import "dotenv/config";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import playformCompress from "@playform/compress";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRemoveComments from "rehype-remove-comments";
import rehypeRewrite from "rehype-rewrite";
import rehypeSlug from "rehype-slug";
import remarkCodeTitles from "remark-flexible-code-titles";

import rehypeImagesInFigures from "./plugins/rehype/images-in-figures";
import rehypeRemoteLinksGetTarget from "./plugins/rehype/remote-links-get-target";
import { remarkReadingTime } from "./plugins/remark/remark-reading-time";
import { rehypeWrapRootElementsInContainers } from "./plugins/rehype/wrap-root-elements-in-containers";
import { rehypeDeleteEmptyElements } from "./plugins/rehype/delete-empty-elements";
import { rehypeWrapParagraphWithTextIntoSections } from "./plugins/rehype/wrap-paragraph-with-text-into-sections";
import { remarkAddToc } from "./plugins/remark/remark-toc";

// https://astro.build/config
export default defineConfig({
  // eslint-disable-next-line no-undef
  site: process.env.PUBLIC_SITE_URL ?? "https://josip.igr.ec",
  image: {
    remotePatterns: [{ protocol: "https" }],
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
    react(),
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
           * @param {string|undefined} language
           * @param {string|undefined} title
           */
          containerProperties: (language, title) => ({
            title,
            "data-language": language,
          }),
          titleTagName: "h6",
          titleClassName: "code-title",
          tokenForSpaceInTitle: "¤",
        },
      ],
      remarkAddToc,
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
          content: {
            type: "text",
            value: "#",
          },
        },
      ],
      [
        rehypeRewrite,
        {
          /**
           * @type {import("rehype-rewrite").RehypeRewriteOptions["rewrite"]}
           */
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          rewrite: (node, _index, _parent) => {
            if (node.type === "element") {
              const style = node.properties.style;
              if (typeof style === "string") {
                node.properties.style = style
                  .replaceAll("--shiki-", "--")
                  .replaceAll("--dark:", "--dark-color:");
              }

              if (node.tagName === "pre") {
                const className = node.properties.class;
                if (typeof className === "string") {
                  if (className.includes("astro-code")) {
                    node.properties.class = "code-contents";
                  }
                }

                delete node.properties.tabindex;
              }
            }
          },
        },
      ],
      rehypeWrapRootElementsInContainers,
      rehypeWrapParagraphWithTextIntoSections,
      rehypeDeleteEmptyElements,
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
    define: {
      __DATE__: `"${new Date().toISOString()}"`,
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: "assets/[hash].[ext]",
          chunkFileNames: "assets/[hash].js",
          entryFileNames: "[hash].js",
        },
      },
    },
  },
  server: {
    host: true,
  },
});

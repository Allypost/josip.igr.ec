import type { CollectionEntry } from "astro:content";
import type { APIRoute } from "astro";
import satori, { type Font } from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import sharp from "sharp";

import { getVisibleBlogPosts, hashData } from "~/app/helpers";
import { SocialTemplate } from "./_social_png_template";

const IOSEVKALLY_FONT_DIR_URL = new URL(
  "./src/assets/font/IosevkAlly/",
  `file://${String(process.env.npm_config_local_prefix)}`,
);

export const ogPostHash = async (post: CollectionEntry<"blog">) => {
  const { remarkPluginFrontmatter } = await post.render();

  const data = {
    title: post.data.title,
    description: post.data.description,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    words: remarkPluginFrontmatter.wordsOnPage,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    minutes: remarkPluginFrontmatter.minutesRead,
  };

  return hashData(data);
};

export async function getStaticPaths() {
  return (await getVisibleBlogPosts()).map((post) => ({
    params: {
      slug: post.slug,
    },
    props: {
      ...post,
    },
  }));
}

const FONT_PATHS = [
  {
    name: "IosevkAllySP",
    weight: 700,
    path: new URL("./IosevkAllySP-Bold.ttf", IOSEVKALLY_FONT_DIR_URL).pathname,
    style: "normal",
  },
  {
    name: "IosevkAllyP",
    weight: 400,
    path: new URL("./IosevkAllyP-Regular.ttf", IOSEVKALLY_FONT_DIR_URL)
      .pathname,
    style: "normal",
  },
] as const;

const FONTS = FONT_PATHS.map((x) => ({
  ...x,
  data: fs.readFileSync(x.path),
})) satisfies Font[];

type BlogPost = CollectionEntry<"blog">;

export const GET: APIRoute<BlogPost> = async ({ props }) => {
  const svg = await satori(
    SocialTemplate({
      ...props,
      rendered: await props.render(),
    }) as never,
    {
      width: 1200,
      height: 630,
      fonts: FONTS,
      // debug: true,
    },
  );

  const png = new Resvg(svg, {
    dpi: 300,
    shapeRendering: 2,
    textRendering: 1,
    imageRendering: 0,
    font: {
      loadSystemFonts: false,
      fontFiles: FONT_PATHS.map((x) => x.path),
    },
  })
    .render()
    .asPng();

  const webp = await sharp(png)
    .webp({
      preset: "text",
    })
    .toBuffer();

  return new Response(webp, {
    status: 200,
    headers: {
      "content-type": "image/webp",
    },
  });
};

import type { CollectionEntry } from "astro:content";
import type { APIRoute } from "astro";
import satori, { type Font } from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";

import { getVisibleBlogPosts, hashData } from "~/app/helpers";
import { HeroTemplate } from "./_hero_png_template";
import sharp from "sharp";

const IOSEVKALLY_FONT_DIR_URL = new URL(
  "./src/assets/font/IosevkAlly/",
  `file://${String(process.env.npm_config_local_prefix)}`,
);

// eslint-disable-next-line @typescript-eslint/require-await
export const heroPostHash = async (post: CollectionEntry<"blog">) => {
  const data = {
    title: post.data.title,
  };

  return hashData(data);
};

export async function getStaticPaths() {
  return Promise.all(
    (await getVisibleBlogPosts()).map(async (post) => ({
      params: {
        slug: post.slug,
        postHash: await heroPostHash(post),
      },
      props: {
        ...post,
      },
    })),
  );
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
    HeroTemplate({
      ...props,
      rendered: await props.render(),
    }) as never,
    {
      width: 1280,
      height: 720,
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

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-undef */
import rss from "@astrojs/rss";

import { BLOG_DESCRIPTION, BLOG_TITLE } from "~/app/consts";
import { getVisibleBlogPosts } from "~/app/helpers";

export async function GET(context) {
  const posts = await getVisibleBlogPosts();

  const heroImages = new Map();

  for (const post of posts) {
    const heroImage = post.data.heroImage
      ? {
          url: post.data.heroImage.src,
          type: `image/${post.data.heroImage.format}`,
          length: 0,
        }
      : {
          url: `/blog/${post.id}.hero.webp`,
          type: `image/webp`,
          length: 0,
        };

    const heroImageUrl = new URL(heroImage.url, context.site);

    heroImage.url = heroImageUrl.toString();

    heroImages.set(post.id, heroImage);
  }

  return rss({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    stylesheet: "/rss/pretty-feed-v3.xsl",
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
      author: post.data.author ?? "Josip Igrec <josip@igr.ec>",
      categories: post.data.tags,
      enclosure: heroImages.get(post.id),
      content: post.rendered?.html,
    })),
  });
}

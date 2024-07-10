import rss from "@astrojs/rss";

import { BLOG_DESCRIPTION, BLOG_TITLE } from "~/app/consts";
import { getVisibleBlogPosts } from "~/app/helpers";

export async function GET(context) {
  const posts = await getVisibleBlogPosts();

  return rss({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    stylesheet: "/rss/pretty-feed-v3.xsl",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  });
}

import rss from "@astrojs/rss";

import { SITE_DESCRIPTION, SITE_TITLE } from "~/app/consts";
import { getVisibleBlogPosts } from "~/app/helpers";

export async function GET(context) {
  const posts = await getVisibleBlogPosts();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  });
}

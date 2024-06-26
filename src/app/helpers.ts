import { getCollection } from "astro:content";

import { REMOTE_CDN_URL, SHOW_DRAFTS, SITE_URL } from "./consts";

const urlHelper = (base: string | URL) => (path?: string | URL) =>
  new URL(path ?? "", base);

export const remoteCdnUrl = urlHelper(REMOTE_CDN_URL);
export const siteUrl = urlHelper(SITE_URL);

export const getVisibleBlogPosts = () =>
  getCollection("blog", ({ data }) => SHOW_DRAFTS || !data.draft).then((x) =>
    x.sort((lt, gt) => gt.data.pubDate.valueOf() - lt.data.pubDate.valueOf()),
  );

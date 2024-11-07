import crypto, {
  type BinaryToTextEncoding,
  type HashOptions,
} from "node:crypto";
import { getCollection } from "astro:content";

import {
  REMOTE_CDN_URL,
  SHOW_DRAFTS,
  SHOW_TESTS,
  SHOW_UNLISTED,
  SITE_URL,
} from "./consts";

const urlHelper = (base: string | URL) => (path?: string | URL) =>
  new URL(path ?? "", base);

export const remoteCdnUrl = urlHelper(REMOTE_CDN_URL);
export const siteUrl = urlHelper(SITE_URL);

export const getVisibleBlogPosts = () =>
  getCollection("blog", ({ data }) => {
    if (data.test && !SHOW_TESTS) {
      return false;
    }

    if (data.draft && !SHOW_DRAFTS) {
      return false;
    }

    return true;
  }).then((x) =>
    x.sort((lt, gt) => gt.data.pubDate.valueOf() - lt.data.pubDate.valueOf()),
  );

export const getListableBlogPosts = () =>
  getVisibleBlogPosts().then((x) =>
    x.filter((x) => {
      if (x.data.unlisted && !SHOW_UNLISTED) {
        return false;
      }

      return true;
    }),
  );

export const hashData = (
  data: unknown,
  props?: Partial<{
    hashAlgorithm: string;
    hashAlgorithmOptions: HashOptions;
    encoding: BinaryToTextEncoding;
  }>,
) => {
  return crypto
    .createHash(props?.hashAlgorithm ?? "sha256", props?.hashAlgorithmOptions)
    .update(JSON.stringify(data))
    .digest(props?.encoding ?? "base64url");
};

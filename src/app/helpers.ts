import { REMOTE_CDN_URL, SITE_URL } from "./consts";

const urlHelper = (base: string | URL) => (path?: string | URL) =>
  new URL(path ?? "", base);

export const remoteCdnUrl = urlHelper(REMOTE_CDN_URL);
export const siteUrl = urlHelper(SITE_URL);

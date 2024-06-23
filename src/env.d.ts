/// <reference path="../.astro/env.d.ts" />
/* eslint-disable @typescript-eslint/consistent-type-definitions */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_REMOTE_CDN_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

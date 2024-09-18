/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/env.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type FalsyString = "false" | "f" | "no" | "n" | "0";

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_REMOTE_CDN_URL?: string;
  readonly SHOW_DRAFTS_IN_PRODUCTION?:
    | (string & {})
    // falsy
    | FalsyString;
  readonly SHOW_TESTS_IN_PRODUCTION?:
    | (string & {})
    // falsy
    | FalsyString;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import astroPlugin from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import a11y from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config} */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...astroPlugin.configs.recommended,
  {
    files: ["./src/**/*.{html,js,mjs,cjs,jsx,md,mdx,svelte,ts,tsx,vue}"],
    plugins: {
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
      import: fixupPluginRules(importPlugin),
      "@stylistic/js": stylisticJs,
      "@stylistic/ts": stylisticTs,
      a11y,
    },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "require-await": "off",
      "@typescript-eslint/require-await": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
          reportUsedIgnorePattern: true,
        },
      ],
      "@stylistic/ts/member-delimiter-style": ["error"],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": ["error"],
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowBoolean: true,
          allowNumber: true,
          allowRegExp: true,
        },
      ],

      "no-lone-blocks": "off",
      camelcase: [
        "error",
        {
          ignoreDestructuring: true,
        },
      ],
      curly: ["error", "all"],
      "dot-notation": "error",
      eqeqeq: ["error", "always"],
      "guard-for-in": "error",
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "no-array-constructor": "error",
      "no-bitwise": "error",
      "@stylistic/js/no-mixed-operators": "error",
      "no-multi-assign": "error",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"],
        },
      ],
      "no-nested-ternary": "error",
      "no-new-func": "error",
      "@stylistic/js/no-tabs": "warn",
      "no-new-wrappers": "error",
      "no-return-assign": ["error", "always"],
      "no-script-url": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-useless-constructor": "error",
      "object-shorthand": ["error", "always"],
      "prefer-arrow-callback": "warn",
      "prefer-const": "warn",
      "prefer-numeric-literals": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "warn",
      "prefer-template": "warn",
      "@stylistic/js/wrap-iife": ["error", "inside"],

      "prettier/prettier": "error",

      "sort-imports": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    },
  },
  {
    files: ["*.astro"],
    rules: {
      "@typescript-eslint/await-thenable": "off",
    },
  },
);

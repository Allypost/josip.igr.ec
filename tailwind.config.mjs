import defaultTheme from "tailwindcss/defaultTheme";

const fontFamilySans = [
  '"IosevkAllyP"',
  '"Iosevka Aile"',
  '"Iosevka"',
  ...defaultTheme.fontFamily.sans,
];

const fontFamilyMono = [
  '"IosevkAlly"',
  '"Iosevka"',
  ...defaultTheme.fontFamily.mono,
];

const fontFamilyDisplay = [
  '"IosevkAllySP"',
  '"Iosevka Etoile"',
  ...fontFamilySans,
];

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:not(.light *) }",
      "&:is(.dark *)",
    ],
  ],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        display: fontFamilyDisplay,
      },
      colors: {
        base: {
          fg: "rgb(var(--color-base-fg) / <alpha-value>)",
          bg: "rgb(var(--color-base-bg) / <alpha-value>)",
        },
        highlight: "rgb(var(--color-highlight) / <alpha-value>)",
        "highlight-muted": "rgb(var(--color-highlight-muted) / <alpha-value>)",
        code: {
          bg: "rgb(var(--color-code-bg) / <alpha-value>)",
        },
      },
    },
    fontFamily: {
      sans: fontFamilySans,
      mono: fontFamilyMono,
    },
  },
  plugins: [],
};

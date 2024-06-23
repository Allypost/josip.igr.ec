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
          fg: "var(--color-base-fg)",
          bg: "var(--color-base-bg)",
        },
        highlight: "var(--color-highlight)",
      },
    },
    fontFamily: {
      sans: fontFamilySans,
      mono: fontFamilyMono,
    },
  },
  plugins: [],
};

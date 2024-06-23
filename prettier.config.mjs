/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import('prettier-plugin-css-order').PluginOptions} */
export default {
  tailwindConfig: "./tailwind.config.mjs",
  tailwindFunctions: ["cn", "clsx", "twMerge", "twCn", "twClsx", "twTwMerge"],
  tailwindAttributes: ["class", "className", "class:list", "mainClass"],
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-css-order",
    "prettier-plugin-tailwindcss",
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

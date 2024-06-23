# My site/blog

## Project Structure

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory or colocated with components or content.

## Commands

All commands are run from the root of the project, from a terminal:

| Command            | Action                                           |
| :----------------- | :----------------------------------------------- |
| `bun install`      | Installs dependencies                            |
| `bun dev`          | Starts local dev server at `localhost:4321`      |
| `bun run build`    | Build your production site to `./dist/`          |
| `bun preview`      | Preview your build locally, before deploying     |
| `bun astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `bun astro --help` | Get help using the Astro CLI                     |

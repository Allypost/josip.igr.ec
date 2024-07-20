const trimUrl = (url: string) => url.trim().replaceAll(/\/*$/g, "");

export const FALSY_ENV_STRINGS = ["false", "f", "no", "n", "0", ""] as const;

export const SITE_TITLE = "josip.igr.ec";

export const SITE_DESCRIPTION =
  "Full-stack engineer who enjoys learning and understanding new technologies.";

export const BLOG_TITLE = "Josip's Blog";

export const BLOG_DESCRIPTION =
  "Opinions about mostly software and technology. Sanity may vary.";

export const REMOTE_CDN_URL = trimUrl(
  import.meta.env.PUBLIC_REMOTE_CDN_URL ?? "https://cdn.allypost.net",
);

export const SITE_URL = trimUrl(import.meta.env.SITE);

export const SHOW_DRAFTS_IN_PRODUCTION = !FALSY_ENV_STRINGS.includes(
  String(import.meta.env.SHOW_DRAFTS_IN_PRODUCTION ?? "false") as never,
);

export const SHOW_DRAFTS = !import.meta.env.PROD || SHOW_DRAFTS_IN_PRODUCTION;

const _technologyIcons = <
  const T extends {
    [key: string]: {
      name: string;
      icon?: string;
    };
  },
>(
  x: T,
) =>
  x as {
    [K in keyof T]: {
      name: string;
      icon: string | undefined;
    };
  };
export const technologyIcons = _technologyIcons({
  vue: {
    name: "Vue",
    icon: "simple-icons:vuedotjs",
  },
  typescript: {
    name: "TypeScript",
    icon: "simple-icons:typescript",
  },
  nuxt: {
    name: "Nuxt",
    icon: "simple-icons:nuxtdotjs",
  },
  nodejs: {
    name: "NodeJS",
    icon: "simple-icons:nodedotjs",
  },
  express: {
    name: "Express",
    icon: "simple-icons:express",
  },
  prisma: {
    name: "Prisma",
    icon: "simple-icons:prisma",
  },
  postgres: {
    name: "PostgreSQL",
    icon: "simple-icons:postgresql",
  },
  graphql: {
    name: "GraphQL",
    icon: "simple-icons:graphql",
  },
  docker: {
    name: "Docker",
    icon: "simple-icons:docker",
  },
  playwright: {
    name: "Playwright",
    icon: "simple-icons:playwright",
  },
  react: {
    name: "React",
    icon: "simple-icons:react",
  },
  next: {
    name: "Next",
    icon: "simple-icons:nextdotjs",
  },
  tailwind: {
    name: "Tailwind",
    icon: "simple-icons:tailwindcss",
  },
  vercel: {
    name: "Vercel",
    icon: "simple-icons:vercel",
  },
  rust: {
    name: "Rust",
    icon: "simple-icons:rust",
  },
  telegram: {
    name: "Telegram",
    icon: "simple-icons:telegram",
  },
  axum: {
    name: "Axum",
  },
  discord: {
    name: "Discord",
    icon: "simple-icons:discord",
  },
  python: {
    name: "Python",
    icon: "simple-icons:python",
  },
  pkl: {
    name: "Pkl",
  },
  bun: {
    name: "Bun",
    icon: "simple-icons:bun",
  },
  elixir: {
    name: "Elixir",
    icon: "simple-icons:elixir",
  },
  phoenix: {
    name: "Phoenix",
    icon: "simple-icons:phoenixframework",
  },
} as const);

export const technologies = [
  "TypeScript",
  "Rust",
  "Go",
  "PHP",
  "Python",
  "Java",
  "Vue/Nuxt",
  "React/NextJS",
  "Docker/compose",
  "PostgreSQL",
  "(S)CSS",
  "Linux",
  "Elixir",
  "NodeJS",
  "GraphQL",
  "JavaScript",
  "Playwright",
  "Express",
  "Fastify",
  "Angular",
  "Tailwind",
  "Git",
  "FreeBSD",
  "nginx",
  "traefik",
  "MySQL",
  "SQLite",
  "Spring Boot",
  "Flask",
  "Symfony",
  "Astro",
  "Erlang",
  "Clojure",
  "C",
];

export const links = {
  github: {
    href: "https://github.com/Allypost",
    text: "GitHub",
    icon: "simple-icons:github",
  },
  telegram: {
    href: "https://t.me/tvoja_mama",
    text: "Telegram",
    icon: "simple-icons:telegram",
  },
  signal: {
    href: "https://signal.me/#eu/ufFtvrezLyxsTqGR8_1wUZk_TZKqdBzz3HdNpOimROglOzpWSt1DCoRZke_MdT4M",
    text: "Signal",
    icon: "simple-icons:signal",
  },
  mastodon: {
    href: "https://mastodon.social/@allypost",
    text: "Mastodon",
    icon: "simple-icons:mastodon",
    handle: "@Allypost@mastodon.social",
  },
  twitter: {
    href: "https://twitter.com/AllyPost",
    text: "Twitter",
    icon: "simple-icons:twitter",
  },
  keybase: {
    href: "https://keybase.io/allypost",
    text: "keybase",
    icon: "simple-icons:keybase",
  },
  linkedin: {
    href: "https://www.linkedin.com/in/josip-igrec/",
    text: "LinkedIn",
    icon: "simple-icons:linkedin",
  },
} as const;

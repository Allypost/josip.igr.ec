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
  "JavaScript",
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

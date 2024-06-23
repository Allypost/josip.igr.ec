import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        draft: z.boolean().optional(),
      })
      .and(
        z.union([
          z.object({
            heroImage: z.never().optional(),
            heroImageAlt: z.never().optional(),
          }),
          z.object({
            heroImage: image(),
            heroImageAlt: z.string(),
          }),
        ]),
      ),
});

export const collections = {
  blog,
};

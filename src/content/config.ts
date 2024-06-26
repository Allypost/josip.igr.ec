import type { ZodNever, ZodOptional, ZodRawShape } from "astro/zod";
import { defineCollection, z } from "astro:content";

const optionalWholeObject = <T extends ZodRawShape>(x: T) => {
  const xObj = z.object(x);
  type TKey = keyof z.infer<typeof xObj>;
  const keys = Object.keys(xObj.shape) as unknown as TKey[];
  const neverObject = Object.fromEntries(
    keys.map((k) => [k, z.never().optional()] as const),
  ) as {
    [K in TKey]: ZodOptional<ZodNever>;
  };

  return z.union([z.object(neverObject), xObj]);
};

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date().transform((d) => {
          d.setUTCHours(12);
          return d;
        }),
        updatedDate: z.coerce.date().transform((d) => {
          d.setUTCHours(12);
          return d;
        }).optional(),
        draft: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
      })
      .and(
        optionalWholeObject({
          heroImage: image(),
          heroImageAlt: z.string(),
        }),
      )
      .and(
        optionalWholeObject({
          socialImage: image(),
          socialImageAlt: z.string(),
        }),
      ),
});

export const collections = {
  blog,
};

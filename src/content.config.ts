import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const blog = defineCollection({
  loader: glob({pattern: '**/*.{md,mdx}', base: './src/content/blog'}),
  schema: z.object({
    title: z.string(), slug: z.string(), description: z.string(), category: z.string(),
    author: z.string(), published: z.coerce.date(), updated: z.coerce.date().optional(),
    draft: z.boolean().default(false), readTime: z.string(), accent: z.string(), badgeText: z.string(),
    image: z.string().optional(), related: z.array(z.string()).default([])
  })
});
export const collections = { blog };

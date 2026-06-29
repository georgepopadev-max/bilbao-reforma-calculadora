import { defineCollection, z } from 'astro:content';

// Permissive schemas — A2 and A3 will replace with strict schemas
// Currently all collections use z.record to avoid build-blocking
// A1's pilot files in src/pages/blog/ use their own frontmatter inline

const blog = defineCollection({
  type: 'content',
  schema: z.record(z.any()),
});

const empresas = defineCollection({
  type: 'content',
  schema: z.record(z.any()),
});

const barrios = defineCollection({
  type: 'content',
  schema: z.record(z.any()),
});

export const collections = { blog, empresas, barrios };
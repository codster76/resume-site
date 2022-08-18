import { z } from 'zod';

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  value: z.number(),
  weight: z.number(),
  quantity: z.number(),
  tags: z.string().array().optional(),
});

export type Item = z.infer<typeof itemSchema>; // Creates a new type

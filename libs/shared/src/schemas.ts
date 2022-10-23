import { z } from 'zod';

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  value: z.preprocess((val: any) => Number(val), z.number()),
  weight: z.preprocess((val: any) => Number(val), z.number()),
  quantity: z.preprocess((val: any) => Number(val), z.number()),
  tags: z.string().array().optional(),
});

export type Item = z.infer<typeof itemSchema>; // Creates a new type

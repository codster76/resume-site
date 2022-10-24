import { z } from 'zod';

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  value: z.preprocess((val: any) => Number(val), z.number()),
  weight: z.preprocess((val: any) => Number(val), z.number()),
  quantity: z.preprocess((val: any) => Number(val), z.number()),
});

export const newBagSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1)
});

export type Item = z.infer<typeof itemSchema>; // Creates a new type
export type NewBagData = z.infer<typeof newBagSchema>; // Creates a new type
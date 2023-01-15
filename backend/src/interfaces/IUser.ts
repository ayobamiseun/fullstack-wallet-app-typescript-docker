import { z } from 'zod';

const userZodSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(3),
  password: z.string().min(8),
  accountId: z.number().int().positive(),
});

const newUserZodSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

type IUser = z.infer<typeof userZodSchema>;
type INewUser = z.infer<typeof newUserZodSchema>;

export { IUser, INewUser };

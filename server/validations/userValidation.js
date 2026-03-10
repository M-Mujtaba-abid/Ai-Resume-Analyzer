import { z } from 'zod';

export const userRegisterSchema = z.object({
  name: z.string().min(3, "Name kam az kam 3 characters ka ho"),
  email: z.string().email("Sahi email address likhein"),
  password: z.string().min(6, "Password kam az kam 6 characters ka ho"),
  role: z.enum(['user', 'admin']).optional(),
});
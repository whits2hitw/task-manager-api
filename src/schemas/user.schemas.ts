import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "The name must be at least 3 characters")
    .max(100, "Too long"),
    
  email: z.email("Invalid email format"),
    
  password: z.string()
    .min(6, "The password must be at least 6 characters long."),
    
  role: z.enum(['admin', 'member'], {
    
  }).optional().default("member")
});

// isso cria um tipo TypeScript automático baseado no Zod
export type CreateUserInput = z.infer<typeof createUserSchema>;
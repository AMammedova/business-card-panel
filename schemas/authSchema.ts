import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "İstifadəçi adı ən azı 3 simvol olmalıdır"),
  password: z.string().min(6, "Şifrə ən azı 6 simvol olmalıdır"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

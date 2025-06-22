import { z } from "zod"
export const UpdateUserSchema = z.object({
  id: z.number(),
  fullName: z.string().min(10, "Obligatoriu").max(100),
})

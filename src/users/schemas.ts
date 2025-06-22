import { z } from "zod"
export const UpdateUserSchema = z.object({
  id: z.number(),
  fullName: z.string().min(10, "Minim 10 litere").max(80, "Max 80 litere"),
})

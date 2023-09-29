import { currencies } from "@prisma/client"
import { z } from "zod"

export const CreatePostSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  title: z.string(),
  body: z.string(),
  // phone: z.string(),
  categoryId: z.preprocess(Number, z.number()),
  // authorId: z.number(),
  price: z.preprocess(Number, z.number()),
  currency: z.nativeEnum(currencies),
})
export const UpdatePostSchema = CreatePostSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeletePostSchema = z.object({
  id: z.number(),
})

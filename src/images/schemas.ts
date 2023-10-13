import { z } from "zod"

export const CreateImageSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateImageSchema = CreateImageSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteImageSchema = z.object({
  id: z.number(),
})

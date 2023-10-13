import { string, z } from "zod"

export const CreateImageSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  fileName: z.string().min(20),
  blob: z.string().min(20),
  postId: z.number(),
})
export const UpdateImageSchema = CreateImageSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteImageSchema = z.object({
  id: z.number(),
})

import { Prisma } from "db"
import path from "path"
export const UPLOADS_PATH = path.resolve(process.cwd(), ".data/uploads")

const UNSAFE_USER_FIELDS = "activationKey hashedPassword".split(" ")
//@ts-ignore
let userFields: any = Prisma.dmmf.datamodel.models.find((model) => model.name === "User").fields
// NOTE get all scalar-like fields and omit sensitive fields
userFields = userFields.filter((f) => f.kind !== "object").map((f) => f.name)

export const imageSelect = { id: true, fileName: true } as Prisma.ImageSelect

export const authorSelect = userFields.reduce((acc, f) => {
  if (!UNSAFE_USER_FIELDS.includes(f)) {
    acc[f] = true
  }
  return acc
}, userFields) as Prisma.UserSelect

// NOTE see https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting
export const postInclude = {
  author: { select: authorSelect },
  images: { select: imageSelect, orderBy: { createdAt: "desc" } },
} as Prisma.PostInclude

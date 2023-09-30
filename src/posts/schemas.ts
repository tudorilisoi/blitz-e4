import { currencies } from "@prisma/client"
import { ZodIssue, z } from "zod"

// const errorMessage = (fieldName) => {
//   const errorMap = (issue: ZodIssue, _ctx: any) => {
//     const errFieldName = issue.path[0]

//     // switch (issue.code) {
//     //   case "invalid_type":
//     //     return { message: "Le sexe doit être homme ou femme." }
//     //   case "invalid_enum_value":
//     //     return { message: "Le sexe doit être homme ou femme." }
//     //   default:
//     //     return { message: "Sexe est invalide" }
//     // }
//   }
// }

const e = (errMessage: string) => {
  return { errorMap: () => ({ message: errMessage }) }
}

export const CreatePostSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  title: z.string({ ...e("Titlul trebuie completat (minim 8 litere)") }).min(8),
  body: z.string({ ...e("Textul trebuie completat (minim 20 de litere)") }).min(20),
  // phone: z.string(),
  categoryId: z.preprocess(Number, z.number({ ...e("Trebuie să alegeţi o categorie") }).min(1)),
  // authorId: z.number(),
  price: z.preprocess(Number, z.number({ ...e("Preţul trebuie să fie zero sau mai mult") })),
  currency: z.nativeEnum(currencies, { ...e("Selectaţi EUR sau RON") }),
})
export const UpdatePostSchema = CreatePostSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeletePostSchema = z.object({
  id: z.number(),
})

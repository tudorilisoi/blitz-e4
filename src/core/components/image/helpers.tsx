import { Image } from "@prisma/client"
import { canonical } from "src/helpers"

export const getImageUrl = (image: Image, responsive: boolean) => {
  const fileName = image.fileName.replace(/\.([^.]+)?$/, ".webp")
  const relativeURL = `/api/poze${responsive ? "/responsive/" : "/"}${image.id}/${fileName}`
  return canonical(relativeURL)
}

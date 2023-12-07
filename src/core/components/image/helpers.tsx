import { Image } from "@prisma/client"

export const getImageUrl = (image: Image, responsive: boolean) => {
  const fileName = image.fileName.replace(/\.([^.]+)?$/, ".webp")
  return `/api/poze${responsive ? "/responsive/" : "/"}${image.id}/${fileName}`
}

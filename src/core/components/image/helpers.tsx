import { Image } from "@prisma/client"

export const getImageUrl = (image: Image, responsive: boolean) => {
  return `/api/poze${responsive ? "/responsive/" : "/"}${image.id}/${image.fileName}`
}

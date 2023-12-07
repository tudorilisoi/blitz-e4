import { Category, Image, Post, User } from "@prisma/client"
import { getImageUrl } from "src/core/components/image/helpers"

export interface PostWithIncludes extends Post {
  images: Image[]
  author: User
  category: Category
}
export interface CategoryWithCounters extends Category {
  postCount: number
}

export const getImagesPreloadLinks = (images: Image[]) => {
  const imagePreloadLinks = images.map((image) => {
    return (
      <link
        key={`image-preload-${image.id}`}
        rel="preload"
        fetchPriority="high"
        as="image"
        href={getImageUrl(image, true)}
        type="image/webp"
      ></link>
    )
  })

  return imagePreloadLinks
}

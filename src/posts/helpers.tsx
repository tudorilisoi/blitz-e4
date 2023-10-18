import { Category, Image, Post, User } from "@prisma/client"

export interface PostWithIncludes extends Post {
  images: Image[]
  author: User
  category: Category
}
export interface CategoryWithCounters extends Category {
  postCount: number
}

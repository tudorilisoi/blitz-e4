import { Category, Image, Post, PrismaClient, User } from "@prisma/client"

export interface PostWithIncludes extends Post {
  images: Image[]
  author: User
  category: Category
}

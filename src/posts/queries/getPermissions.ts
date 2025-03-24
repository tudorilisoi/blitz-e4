import { resolver } from "@blitzjs/rpc"
import db from "db"
import { HasAuthor, isAuthor, mayDelete, mayEdit, mayPromote } from "src/auth/helpers"
import { z } from "zod"

const GetPermissions = z.object({
  ids: z.number().array(),
})

export interface PermissionFlags {
  mayEdit: boolean
  mayDelete: boolean
  isAuthor: boolean
  mayPromote: boolean
}

export type Permissions = Record<number, PermissionFlags>

export const getPermissionsForPosts = async (posts: HasAuthor[], context) => {
  const ret: Permissions = {}
  for (let post of posts) {
    const _mayEdit = await mayEdit(post, context)
    const _mayDelete = await mayDelete(post, context)
    const _mayPromote = await mayPromote(post, context)
    const _isAuthor = await isAuthor(post, context)
    ret[post.id] = {
      mayEdit: _mayEdit,
      isAuthor: _isAuthor,
      mayDelete: _mayDelete,
      mayPromote: _mayPromote,
    }
  }
  return ret
}

export default resolver.pipe(resolver.zod(GetPermissions), async ({ ids }, context) => {
  const posts = await db.post.findMany({
    select: { id: true, userId: true },
    where: { id: { in: ids } },
  })
  return getPermissionsForPosts(posts, context)
})

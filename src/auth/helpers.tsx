import getCurrentUser from "src/users/queries/getCurrentUser"

interface HasAuthor {
  authorId: number
}

export const isAuthor = async (model: HasAuthor, context) => {
  const user = await getCurrentUser(null, context)
  return user && model.authorId === user.id
}

export const mayEdit = async (model: HasAuthor, context) => {
  const _isAuthor = await isAuthor(model, context)
  if (_isAuthor) {
    return true
  }
  const user = await getCurrentUser(null, context)
  if (user?.role === "SUPERADMIN") {
    return true
  }
}

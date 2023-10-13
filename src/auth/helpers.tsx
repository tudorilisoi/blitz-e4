import { AuthorizationError, NotFoundError } from "blitz"
import getCurrentUser from "src/users/queries/getCurrentUser"

interface HasAuthor {
  userId: number
}

export const isAuthor = async (model: HasAuthor, context) => {
  const user = await getCurrentUser(null, context)
  return user && model.userId === user.id
}

export const mayEdit = async (model: HasAuthor, context) => {
  const _isAuthor = await isAuthor(model, context)
  if (_isAuthor) {
    return true
  }
  const user = await getCurrentUser(null, context)
  if (user?.banned === true) {
    return false
  }
  if (user?.role === "SUPERADMIN") {
    return true
  }
  return false
}

export const guardEdit = async (model: HasAuthor | null, context) => {
  if (!model) {
    throw new NotFoundError("No such record")
  }
  const allowed = await mayEdit(model, context)
  if (!allowed) {
    throw new AuthorizationError("Aceess denied")
  }
}

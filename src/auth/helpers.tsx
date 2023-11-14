import { AuthorizationError, NotFoundError } from "blitz"
import getCurrentUser from "src/users/queries/getCurrentUser"

export interface HasAuthor {
  id: number
  userId: number
}

export const isAuthenticated = async (context) => {
  const user = await getCurrentUser(null, context)
  return !!user
}

export const isAuthor = async (model: HasAuthor, context) => {
  const user = await getCurrentUser(null, context)
  return !user ? false : model.userId === user.id
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
  return false
}
// TODO reject login for banned users
export const guardAuthenticated = async (context) => {
  const user = await getCurrentUser(null, context)
  if (!user) {
    throw new AuthorizationError("Nu sunteţi conectat")
  }
  if (user.banned) {
    throw new AuthorizationError("Acest utilizator este blocat")
  }
}

export const guardEdit = async (model: HasAuthor | null, context) => {
  await guardAuthenticated(context)
  if (!model) {
    throw new NotFoundError("No such record")
  }
  const allowed = await mayEdit(model, context)
  if (!allowed) {
    throw new AuthorizationError("Acces refuzat")
  }
}

import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
import { AuthenticationError } from "blitz"
import db, { UserRoles } from "db"
import { verifyEmailMailer } from "mailers/verifyEmailMailer"
import { Role } from "types"
import { verifyCapJS } from "../helpers"
import { Login } from "../schemas"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })
  const user = await db.user.findFirst({ where: { email } })
  if (!user) {
    const err = new AuthenticationError("Acest e-mail nu este înregistrat, creaţi un cont")
    err.statusCode = 404
    err.name = "ACCOUNT_NOT_FOUND"
    throw err
  }

  if (user.role === UserRoles.USER_UNVERIFIED) {
    const err = new AuthenticationError(
      "Contul nu este activat, vi s-a trimis pe e-mail un mesaj de activare",
    )
    err.statusCode = 401
    err.name = "ACCOUNT_NOT_VERIFIED"
    await verifyEmailMailer({ to: user.email, activationKey: user.activationKey || "oo_OO" }).send()
    throw err
  }

  if (user.hashedPassword === "CHANGEME") {
    const err = new AuthenticationError("Trebuie să resetaţi parola")
    err.statusCode = 401
    err.name = "PASSWORD_NEEDS_RESET"
    throw err
  }

  try {
    const result = await SecurePassword.verify(user.hashedPassword, password)
    if (result === SecurePassword.VALID_NEEDS_REHASH) {
      // Upgrade hashed password with a more secure hash
      const improvedHash = await SecurePassword.hash(password)
      await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
    }
    const { hashedPassword, ...rest } = user
    return rest
  } catch (error) {
    console.log(`🚀 ~ authenticateUser ~ error:`, error)
    if (error.statusCode === 401) {
      const err = new AuthenticationError("Parola este incorectă")
      err.statusCode = 401
      err.name = "WRONG_PASSWORD"
      throw err
    }
    throw error
  }
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password, capjsToken }, ctx) => {
  await verifyCapJS(capjsToken)
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  return user
})

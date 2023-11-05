import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Role } from "types"
import { Signup } from "../schemas"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  const existing = await db.user.findFirst({ where: { email } })
  if (existing) {
    const err: any = new Error("Acest cont există deja")
    err.code = "USER_EXISTS"
    err.statusCode = 500
    throw err
  }
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: { email: email.toLowerCase().trim(), hashedPassword, role: "USER" },
    select: { id: true, fullName: true, email: true, role: true },
  })

  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})

import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
import db, { UserRoles } from "db"
import { verifyEmailMailer } from "mailers/verifyEmailMailer"
import { nanoid } from "nanoid"
import { Signup } from "../schemas"

export default resolver.pipe(
  resolver.zod(Signup),
  async ({ email, password, fullName, phone, capjsToken }, ctx) => {
    console.log(`🚀 ~ capjsToken:`, capjsToken)
    const verifyURL = `${process.env.CAPJS_DOCKER_ENDPOINT}siteverify`
    const data = {
      response: capjsToken,
      secret: process.env.CAPJS_SECRET,
    }
    const response = await fetch(verifyURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const verifyResult = await response.json()
    console.log(`🚀 ~ verifyResult:`, verifyResult)
    if (verifyResult.success !== true) {
      const err: any = new Error("Verificarea antirobot a eșuat")
      err.name = "CAPTCHA_FAILED"
      err.statusCode = 400
      throw err
    }
    return true

    const existing = await db.user.findFirst({ where: { email } })
    if (existing) {
      const err: any = new Error("Acest cont există deja")
      err.name = "USER_EXISTS"
      err.statusCode = 500
      throw err
    }
    const hashedPassword = await SecurePassword.hash(password.trim())
    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        hashedPassword,
        role: UserRoles.USER_UNVERIFIED,
        fullName,
        phone,
        activationKey: nanoid(),
      },
      select: { id: true, fullName: true, email: true, role: true, activationKey: true },
    })

    await verifyEmailMailer({ to: email, activationKey: user.activationKey || "oo_OO" }).send()

    // NOTE auto login
    // await ctx.session.$create({ userId: user.id, role: user.role as Role })
    return user
  },
)

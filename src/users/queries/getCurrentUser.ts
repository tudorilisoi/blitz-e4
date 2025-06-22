import { Ctx } from "blitz"
import db from "db"
import { authorSelect } from "src/config"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: authorSelect,
  })
  if (user && user?.email === process.env.SUPERADMIN_EMAIL) {
    user.role = "SUPERADMIN"
  }

  return user
}

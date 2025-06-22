import { Ctx, NotFoundError } from "blitz"
import db from "db"

export default async function getUser({ id }: { id: number }, ctx: Ctx) {
  const user = await db.user.findFirst({ where: { id } })

  if (!user) throw new NotFoundError()

  return user
}

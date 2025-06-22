import { Ctx, NotFoundError } from "blitz"
import db from "db"
import { authorSelect } from "./../../config"

export default async function getUser({ id }: { id: number }, ctx: Ctx) {
  const user = await db.user.findFirst({ where: { id }, select: authorSelect })

  if (!user) throw new NotFoundError()

  return user
}

// To access your database
// Append api/* to import from api and web/* to import from web
import type { Prisma } from "@prisma/client"
import db from "./index"
// import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import fs from "fs"
import { nanoid } from "nanoid"

function mapUser(xuser: Record<string, any>): Prisma.UserUncheckedCreateInput | null {
  const {
    id,
    email,
    phone,
    username,
    first_name,
    last_name,
    status,
    date_created,
    date_modified,
    date_last_visit,
  } = xuser
  if (status === 2) {
    return null
  }
  let fullName = username
  if (first_name || last_name) {
    const _fullName = `${first_name.trim()} ${last_name.trim()}`.trim()
    if (_fullName.length > username.length) {
      fullName = _fullName
    }
  }
  // const [hashedPassword, salt] = hashPassword(`` + Math.random() * 100)
  return {
    id,
    phone,
    email,
    fullName,
    role: "USER",
    createdAt: new Date(date_created),
    updatedAt: new Date(date_modified),
    // lastVisitAt: !date_last_visit ? null : new Date(date_last_visit),
    // salt,
    hashedPassword: "CHANGEME",
    activationKey: nanoid(),
  }
}
export const importUsers = async () => {
  try {
    let userData = JSON.parse(
      fs.readFileSync(`${__dirname}/../.data/db_seed/xuser.json`).toString()
    )
      .data.map(mapUser)
      .filter((data) => data !== null)
    console.log(`UserData parsed ${userData.length} records`)

    await db.image.deleteMany({ where: {} })
    console.log("Images deleted")
    await db.post.deleteMany({ where: {} })
    console.log("Posts deleted")
    await db.category.deleteMany({ where: {} })
    console.log("Categories deleted")

    await db.token.deleteMany({ where: {} })
    await db.user.deleteMany({ where: {} })
    console.log("Users deleted")

    const result = await db.user.createMany({
      data: userData,
    })
    console.log("UserData imported")
  } catch (error) {
    console.log("ERROR IMPORTING USERS", error)
  }

  // Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster
  // @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
  // Promise.all(

  //   userData.map(async (data) => {
  //     const record = await db.user.create({ data })
  //     console.log(record)
  //   })
  // )
}

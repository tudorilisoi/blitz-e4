// To access your database
// Append api/* to import from api and web/* to import from web
import type { Prisma } from "@prisma/client"
import db from "./index"
// import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import fs from "fs"

function mapUser(xuser: Record<string, any>): Prisma.UserUncheckedCreateInput | null {
  const {
    id,
    email,
    phone,
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
  // const [hashedPassword, salt] = hashPassword(`` + Math.random() * 100)
  return {
    id,
    phone,
    email,
    fullName: `${first_name} ${last_name}`.trim(),
    role: "USER",
    createdAt: new Date(date_created),
    updatedAt: new Date(date_modified),
    // lastVisitAt: !date_last_visit ? null : new Date(date_last_visit),
    // salt,
    hashedPassword: "CHANGEME",
  }
}
export const importUsers = async () => {
  try {
    let userData = JSON.parse(fs.readFileSync(`${__dirname}/../.data/xuser.json`).toString())
      .xuser.map(mapUser)
      .filter((data) => data !== null)
    console.log("UserData parsed")

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

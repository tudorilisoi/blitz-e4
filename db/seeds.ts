// import db from "./index"

import db from "db"
import importPosts from "./importPosts"
import { importUsers } from "./importUsers"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * to easily generate realistic data.
 */
const seed = async () => {
  await importUsers()
  await importPosts()

  //update sequences because we inserted IDs explicitly

  const updateSequences = [
    `SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User")+100)`,
    `SELECT setval('"Post_id_seq"', (SELECT MAX(id) FROM "Post")+100)`,
    `SELECT setval('"Image_id_seq"', (SELECT MAX(id) FROM "Image")+100)`,
    `SELECT setval('"Category_id_seq"', (SELECT MAX(id) FROM "Category")+100)`,
  ]
  for (const q of updateSequences) {
    const res = await db.$queryRawUnsafe(q)
    console.log("UPDATE SEQUENCE", q, res)
  }

  // for (let i = 0; i < 5; i++) {
  //   await db.project.create({ data: { name: "Project " + i } })
  // }
}

export default seed

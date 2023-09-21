// import db from "./index"

import { importUsers } from "./importUsers"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * to easily generate realistic data.
 */
const seed = async () => {
  try {
    await importUsers()
  } catch (error) {
    console.log("ERROR IMPORTING USERS", error)
  }
  // for (let i = 0; i < 5; i++) {
  //   await db.project.create({ data: { name: "Project " + i } })
  // }
}

export default seed

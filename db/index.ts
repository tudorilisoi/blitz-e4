import { PrismaClient } from "@prisma/client"
import { PrismaClientOptions } from "@prisma/client/runtime/library"
import { enhancePrisma } from "blitz"

const EnhancedPrisma = enhancePrisma(PrismaClient)
const prismaOptions: PrismaClientOptions = {
  // Enable query logging
  // log: ["query"],
}

export * from "@prisma/client"
const db = new EnhancedPrisma(prismaOptions)
// db.$on("query", (e) => {
//   // console.log("Query ev: ", e)
//   // console.log('Params: ' + e.params)
//   // console.log('Duration: ' + e.duration + 'ms')
// })
export default db

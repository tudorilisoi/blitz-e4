import { PrismaClient } from "@prisma/client"
import { PrismaClientOptions } from "@prisma/client/runtime/library"
import { enhancePrisma } from "blitz"
import { meiliClient } from "src/meili"

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
db.$use(async (params, next) => {
  // Check incoming query type
  const { action, model, args } = params
  const { data } = args

  await beforeDelete("Post", params)

  const actions = "create delete deleteMany".split(" ")
  return next(params).then(async (res) => {
    await afterCreateOrUpdate("Post", params, res)
    return res
  })
})

const postSelect = {
  id: true,
  title: true,
  body: true,
  phone: true,
  category: { select: { title: true, slug: true } },
  author: {
    select: { fullName: true, phone: true },
  },
}

async function afterCreateOrUpdate(modelName, params, res) {
  const { action, model, args } = params
  const { data } = args
  if (modelName !== model || !["create", "createMany", "update", "updateMany"].includes(action)) {
    return
  }
  try {
    if (["create", "createMany", "update", "updateMany"].includes(action)) {
      // TODO get actual data, where{} might not match anymore
      //@ts-ignore
      const records = await db[model].findMany({
        where: { id: res.id },
        select: postSelect,
      })
      console.log(`DB: ${action} ${model} res`, res, records)
      meiliClient.index(model).addDocuments(records)
    }
  } catch (error) {}
}

async function beforeDelete(modelName, params) {
  const { action, model, args } = params
  const { data, where } = args
  if (modelName !== model || !["delete", "deleteMany"].includes(action)) {
    return
  }
  try {
    //@ts-ignore
    const modelIds = await db[model].findMany({ where, select: { id: true } })
    const ids = modelIds.map((el) => el.id)
    meiliClient.index(modelName).deleteDocuments(ids)
  } catch (error) {}
}

export default db

import { PrismaClient } from "@prisma/client"
import { PrismaClientOptions } from "@prisma/client/runtime/library"
import { enhancePrisma } from "blitz"
import dayjs from "dayjs"
import { meiliClient } from "integrations/meili/meili"
import { postInclude } from "src/config"

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

/* const postSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  expiresAt: true,
  title: true,
  body: true,
  phone: true,
  price: true,
  category: { select: { title: true, slug: true } },
  author: {
    select: { fullName: true, phone: true, email: true },
  },
} */

export const mapPostToMeili = (post) => {
  return {
    ...post,
    updatedTimestamp: dayjs(post.updatedAt).unix(),
  }
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
        // select: postSelect,
        include: postInclude,
      })
      // console.log(`DB: ${action} ${model} res`, res, records)
      await meiliClient.index(model).addDocuments(records.map(mapPostToMeili))
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
    await meiliClient.index(modelName).deleteDocuments(ids)
  } catch (error) {}
}

export default db

//  promotion levels for sorting and highlighting, the higher the better
export const PROMOTION_LEVELS = {
  DEFAULT: 0,
  CATEGORY_TOP: 100,
  FRONTPAGE: 200,
}

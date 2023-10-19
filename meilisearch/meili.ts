import _env from "@next/env"
import { MeiliSearch } from "meilisearch"
import path from "path"
const root = process.cwd()
console.log(`🚀 ~ root:`, root)

_env.loadEnvConfig(root)

const client = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
})
const init = async () => {
  const indexes = ["posts"]
  for (let index of indexes) {
    try {
      const res = await client.createIndex(index, { primaryKey: "id" })
      console.log(`CREATE INDEX ${index}:`, res)
    } catch (error) {
      console.log(`ERROR ${index} index `, error)
    }
  }
}
init()
  .then((res) => {
    console.log(`MEILI INIT DONE`, res)
  })
  .catch((error) => {
    console.error(`MEILI INIT ERROR`, error)
  })

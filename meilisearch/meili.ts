import { loadEnvConfig } from "@next/env"
import { MeiliSearch } from "meilisearch"

const root = process.cwd()
console.log(`🚀 ~ root:`, root)

loadEnvConfig(process.cwd())
const client = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
})
const init = async () => {
  const indexes = ["Post"]
  for (let index of indexes) {
    try {
      const res = await client.createIndex(index, { primaryKey: "id" })
      console.log(`CREATE INDEX ${index}:`, res)
    } catch (error) {
      console.log(`ERROR ${index} index `, error)
    }
  }
}
globalThis.__MEILI_INITIALIZED = false
if (!globalThis.__MEILI_INITIALIZED) {
  globalThis.__MEILI_INITIALIZED = true

  init()
    .then((res) => {
      console.log(`MEILI INIT DONE`, res)
    })
    .catch((error) => {
      console.error(`MEILI INIT ERROR`, error)
    })
}

export { client as meiliClient }

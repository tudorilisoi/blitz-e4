import _env from "@next/env"
import { error } from "console"
import { MeiliSearch } from "meilisearch"
_env.loadEnvConfig("../")

const client = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
})
const init = async () => {
  const indexes = ["posts"]
  for (let index of indexes) {
    try {
      const res = await client.createIndex(index, { primaryKey: "id" })
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

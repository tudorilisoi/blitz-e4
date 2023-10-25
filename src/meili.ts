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

  const keys = await client.getKeys()
  let searchKey = keys.results.find((k) => k.name === "PublicKeySearchAllIndexes")
  console.log(`EXISTING searchKey:`, searchKey)

  if (!searchKey) {
    await client
      .createKey({
        uid: "4c607b1e15ccb4b1e0453d369039268d",
        name: "PublicKeySearchAllIndexes",
        actions: ["search"],
        indexes: ["*"],
        expiresAt: null,
      })
      .then((key) => {
        searchKey = key
        console.log("CREATED searchKey::", key)
        // replaceEnv(".env", "NEXT_PUBLIC_MEILI_SEARCH_KEY", key.key)
      })
      .catch((err) => {
        console.log("CREATE KEY ERR:", err)
      })
  }

  if (searchKey && searchKey.key !== process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY) {
    console.error(`Please update your env file by setting this:

    NEXT_PUBLIC_MEILI_SEARCH_KEY=${searchKey.key}

    `)
  }

  const { results: existingIndexes } = await client.getIndexes()

  for (let index of indexes) {
    let idx = existingIndexes.find((i) => i.uid === index)
    if (idx) {
      console.log(`EXISTING INDEX`, index)
      continue
    }
    try {
      const res = await client.createIndex(index, { primaryKey: "id" })
      console.log(`CREATE INDEX ${index}:`, res)
    } catch (error) {
      console.log(`ERROR ${index} index `, error)
    }
  }
}
process.env.__MEILI_INITIALIZED = ""
if (!process.env.__MEILI_INITIALIZED) {
  process.env.__MEILI_INITIALIZED = "true"

  init()
    .then((res) => {
      console.log(`MEILI INIT DONE`, res)
    })
    .catch((error) => {
      console.error(`MEILI INIT ERROR`, error)
    })
}

export { client as meiliClient }

function replaceEnv(envFilePath, targetVariable, newValue) {
  const fs = require("fs")

  // Specify the .env file path
  // const envFilePath = '.env';

  // Specify the variable you want to replace
  // const targetVariable = "MY_VARIABLE"

  // Specify the new value for the variable
  // const newValue = "new_value"

  fs.readFile(envFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading ${envFilePath}: ${err}`)
      return
    }

    // Use regular expressions to replace the variable's value
    let updatedEnv = data.replace(
      new RegExp(`${targetVariable}=.+`),
      `${targetVariable}=${newValue}`
    )

    if (data === updatedEnv && !updatedEnv.includes(`${targetVariable}=`)) {
      updatedEnv = `
      ${updatedEnv}
      ${targetVariable}=${newValue}
      `
    }

    // Write the updated .env file
    fs.writeFile(envFilePath, updatedEnv, "utf8", (writeErr) => {
      if (writeErr) {
        console.error(`Error writing ${envFilePath}: ${writeErr}`)
      } else {
        console.log(`Updated ${envFilePath}: ${targetVariable}=${newValue}`)
      }
    })
  })
}

import { loadEnvConfig } from "@next/env"
import { MeiliSearch } from "meilisearch"
import { stopwordsFiltered } from "./stopwords"
// https://raw.githubusercontent.com/stopwords-iso/stopwords-ro/master/raw/stopwords-filter-ro.txt

const root = process.cwd()

loadEnvConfig(process.cwd())
const client = new MeiliSearch({
  host: process.env.MEILI_URL || "http://localhost:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
})

const logger = (...args) => {
  if (!process.env.MEILI_VERBOSE) {
    return null
  }
  return console.log.apply(console.log, args)
}

logger(`MEILI: root`, root)

export const init = async () => {
  const indexes = ["Post"]

  const keys = await client.getKeys()
  let searchKey = keys.results.find((k) => k.name === "PublicKeySearchAllIndexes")
  logger(`MEILI: EXISTING searchKey:`, searchKey)

  if (!searchKey) {
    // NOTE the actual searchKey.key which is used client-side is deterministic based on given uid
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
        logger("MEILI: CREATED searchKey::", key)
        // replaceEnv(".env", "NEXT_PUBLIC_MEILI_SEARCH_KEY", key.key)
      })
      .catch((err) => {
        logger("MEILI: CREATE KEY ERR:", err)
      })
  }

  if (searchKey && searchKey.key !== process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY) {
    console.error(`MEILI: Please update your env file by setting this:

    NEXT_PUBLIC_MEILI_SEARCH_KEY=${searchKey.key}

    `)
  }

  const { results: existingIndexes } = await client.getIndexes()

  for (let index of indexes) {
    let idx = existingIndexes.find((i) => i.uid === index)
    if (idx) {
      logger(`MEILI: EXISTING INDEX`, index)
      if (index === "Post") {
        await client.index(index).updateSynonyms({
          chirie: ["închiriez", "închiriere", "închiriază", "închiriat"],
          "de vinzare": ["vand"],
          vand: ["de vanzare", "vanzare", "vandut", "vinde", "vind"],
          "vand telefon": ["vand telefon mobil", "vand smartphone"],
          "vind telefon": ["vand telefon mobil", "vand smartphone"],
          vinzare: ["de vinzare", "de vanzare", "vanzare", "vandut", "vinde", "vand"],
          munca: ["angajare", "angajeaza", "angajari", "angajez"],
        })
        const synonims = await client.index(index).getSynonyms()
        logger(`MEILI: INDEX ${index} SYNONIMS:`, synonims)
        let settings = await client.index(index).getSettings()
        settings.stopWords = stopwordsFiltered
        await client.index(index).updateSettings(settings)
        settings = await client.index(index).getSettings()
        logger(`MEILI: ${index} SETTINGS`, settings)
      }
      continue
    }
    try {
      const res = await client.createIndex(index, { primaryKey: "id" })
      logger(`MEILI: CREATE INDEX ${index}:`, res)
    } catch (error) {
      logger(`MEILI: ERROR ${index} index `, error)
    }
  }
  try {
    await client
      .index("Post")
      .updateLocalizedAttributes([{ locales: ["ron"], attributePatterns: ["*"] }])
    await client
      .index("Post")
      .updateSortableAttributes(["title", "updatedTimestamp", "createdTimestamp", "promotionLevel"])
    await client.index("Post").updateFilterableAttributes(["updatedTimestamp"])
    await client
      .index("Post")
      .updateSearchableAttributes([
        "title",
        "body",
        "category.title",
        "author.fullName",
        "author.phone",
        "author.email",
      ])
    await client.index("Post").updateRankingRules([
      "words",
      "proximity",
      "attribute",
      "sort",
      // "updatedTimestamp:desc",
      "exactness",
      "typo",
    ])
    logger(`MEILI: Settings updated`)
  } catch (error) {
    logger(`MEILI: ERROR on Post index `, error)
  }
}

// NOTE use/api/meili to reinitialize meili

/* process.env.__MEILI_INITIALIZED = "true"
if (!process.env.__MEILI_INITIALIZED) {
  process.env.__MEILI_INITIALIZED = "true"

  init()
    .then((res) => {
      logger(`MEILI: INIT DONE`, res)
    })
    .catch((error) => {
      console.error(`MEILI: INIT ERROR`, error)
    })
} */

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
        logger(`Updated ${envFilePath}: ${targetVariable}=${newValue}`)
      }
    })
  })
}

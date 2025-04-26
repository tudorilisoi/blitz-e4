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

  let idx = existingIndexes.find((i) => i.uid === "Post")
  if (idx) {
    logger(`MEILI: EXISTING INDEX`, "Post")
  } else {
    try {
      const res = await client.createIndex("Post", { primaryKey: "id" })
      logger(`MEILI: CREATE INDEX ${"Post"}:`, res)
    } catch (error) {
      logger(`MEILI: ERROR ${"Post"} index `, error)
    }
  }

  try {
    let index = "Post"
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
    await client
      .index("Post")
      .updateRankingRules(["words", "typo", "sort", "proximity", "attribute", "exactness"])
    logger(`MEILI: Settings updated`)
    console.log("Sleeping...")

    await client.index(index).updateSynonyms({
      chirie: ["închiriez", "închiriere", "închiriază", "închiriat"],
      "de vinzare": ["vand"],
      vand: ["de vanzare", "vanzare", "vandut", "vinde", "vind"],
      "vand telefon": ["vand telefon mobil", "vand smartphone"],
      "vind telefon": ["vand telefon mobil", "vand smartphone"],
      vinzare: ["de vinzare", "de vanzare", "vanzare", "vandut", "vinde", "vand"],
      munca: ["angajare", "angajeaza", "angajari", "angajez"],
      apartament: ["ap.", "ap", "apartment"],
    })
    const synonims = await client.index(index).getSynonyms()
    logger(`MEILI: INDEX ${index} SYNONIMS:`, synonims)
    const settings = await client.index("Post").getSettings()
    settings.stopWords = stopwordsFiltered
    if (settings.typoTolerance) {
      settings.typoTolerance.enabled = true
    } else {
      settings.typoTolerance = { enabled: true }
    }
    await client.index(index).updateSettings(settings)
    await new Promise((r) => setTimeout(r, 5000))
    const finalSettings = await client.index(index).getSettings()
    // logger(`MEILI: ${index} SETTINGS`, settings)
    logger(`MEILI: Post index FINAL SETTINGS`, finalSettings)
  } catch (error) {
    logger(`MEILI: ERROR on Post index `, error)
  }
}

// NOTE use /api/meili route to reinitialize meili

export { client as meiliClient }

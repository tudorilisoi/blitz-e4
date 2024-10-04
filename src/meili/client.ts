import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"

const { searchClient } = instantMeiliSearch(
  process.env.NEXT_PUBLIC_MEILI_URL || "http://localhost:7700",
  process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY
)

export { searchClient }

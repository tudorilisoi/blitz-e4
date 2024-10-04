import Layout from "src/core/layouts/Layout"

import { InfiniteHits, InstantSearch, SearchBox } from "react-instantsearch"
import { searchClient } from "src/meili/client"

export default function SearchPage({}) {
  return (
    <InstantSearch indexName="Post" searchClient={searchClient}>
      <SearchBox />
      <InfiniteHits />
    </InstantSearch>
  )
}
SearchPage.getLayout = (page) => <Layout>{page}</Layout>

const Hit = ({ post }) => (
  <article key={post.id}>
    <h1>{post.title}</h1>
    <p>${post.body}</p>
  </article>
)

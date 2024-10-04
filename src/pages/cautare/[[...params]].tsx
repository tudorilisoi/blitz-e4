import Layout from "src/core/layouts/Layout"

import { InfiniteHits, InstantSearch, SearchBox } from "react-instantsearch"
import { searchClient } from "src/meili/client"

export default function SearchPage({}) {
  return (
    <InstantSearch indexName="Post" searchClient={searchClient}>
      <SearchBox />
      <InfiniteHits hitComponent={Hit} />
    </InstantSearch>
  )
}
SearchPage.getLayout = (page) => <Layout>{page}</Layout>

const Hit = ({ hit }) => {
  // return <pre>{JSON.stringify(props, null, 2)}</pre>
  return (
    <article key={hit.id}>
      <h1>{hit.title}</h1>
      {/* <p>{hit.body}</p> */}
    </article>
  )
}

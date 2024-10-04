import Layout from "src/core/layouts/Layout"

import { InfiniteHits, InstantSearch, SearchBox, SortBy } from "react-instantsearch"
import { searchClient } from "src/meili/client"
import { PostWithIncludes } from "src/posts/helpers"
import PostCell from "src/posts/components/PostCell/PostCell"

export default function SearchPage({}) {
  return (
    <InstantSearch indexName="Post" searchClient={searchClient}>
      <SortBy
        items={[
          { label: "Updated (desc)", value: "Post:updatedTimestamp:desc" },
          { label: "Title asc", value: "Post:title:asc" },
          { label: "Title desc", value: "Post:title:desc" },
        ]}
      />
      <div className="max-w-lg">
        <SearchBox
          classNames={{
            input: "w-full p-4 mb-4",
            form: "",
            reset: "hidden text-primary",
          }}
        />
        <InfiniteHits hitComponent={Hit} />
      </div>
    </InstantSearch>
  )
}
SearchPage.getLayout = (page) => <Layout>{page}</Layout>

const Hit = ({ hit }) => {
  // return <pre>{JSON.stringify(props, null, 2)}</pre>
  console.log(hit.updatedTimestamp)
  const post = hit as PostWithIncludes
  return (
    <div className="mb-2">
      <PostCell key={post.id} post={post} />
    </div>
  )
}

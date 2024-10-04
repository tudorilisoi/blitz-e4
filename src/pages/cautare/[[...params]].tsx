import Layout from "src/core/layouts/Layout"

import {
  InfiniteHits,
  InstantSearch,
  SearchBox,
  SortBy,
  useInfiniteHits,
} from "react-instantsearch"
import { searchClient } from "src/meili/client"
import { PostWithIncludes } from "src/posts/helpers"
import PostCell from "src/posts/components/PostCell/PostCell"
import Head from "next/head"

const DEFAULT_SORT = "Post:updatedTimestamp:desc,Post:title:asc"

export default function SearchPage({}) {
  // NOTE docs here https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/
  const head = (
    <Head>
      <title>{`Caută anunțuri în Rădăuți`}</title>
    </Head>
  )

  const initialUIState = {
    Post: {
      // query: 'phone',
      // page: 5,
      sortBy: DEFAULT_SORT,
    },
  }

  return (
    <>
      {head}
      <div className="prose mb3 mb-4">
        <h1 className="text-2xl text-base-content">Căutare</h1>
      </div>
      <InstantSearch initialUiState={initialUIState} indexName="Post" searchClient={searchClient}>
        <SortBy
          className="hidden"
          items={[
            { label: "Updated (desc)", value: DEFAULT_SORT },
            // { label: "Title asc", value: "Post:title:asc" },
            // { label: "Title desc", value: "Post:title:desc" },
          ]}
        />
        <div className="">
          <SearchBox
            classNames={{
              input: "w-full p-4 mb-4",
              form: "",
              reset: "hidden",
            }}
          />
          <CustomInfiniteHits />
        </div>
      </InstantSearch>
    </>
  )
}
SearchPage.getLayout = (page) => <Layout>{page}</Layout>

const Hit = ({ hit }) => {
  // return <pre>{JSON.stringify(props, null, 2)}</pre>
  // console.log(hit.updatedTimestamp)
  const post = hit as PostWithIncludes
  return (
    <div className="mb-2">
      <PostCell post={post} />
    </div>
  )
}

function CustomInfiniteHits(props) {
  const {
    items,
    currentPageHits,
    results,
    banner,
    isFirstPage,
    isLastPage,
    showPrevious,
    showMore,
    sendEvent,
  } = useInfiniteHits(props)
  console.log(`🚀 ~ CustomInfiniteHits ~ results:`, results)

  const isInitial = results?.query === ""

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
      {isInitial ? null : items.map((item) => <Hit key={item.id} hit={item} />)}
    </div>
  )
}

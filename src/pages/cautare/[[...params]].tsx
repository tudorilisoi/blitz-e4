import Layout from "src/core/layouts/Layout"

import Head from "next/head"
import singletonRouter from "next/router"
import { InstantSearch, SearchBox, SortBy, useInfiniteHits } from "react-instantsearch"
import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs"
import { searchClient } from "src/meili/client"
import PostCell from "src/posts/components/PostCell/PostCell"
import { PostWithIncludes } from "src/posts/helpers"
import { useEffect, useRef } from "react"
import styles from "./search.module.css"

const DEFAULT_SORT = "Post:updatedTimestamp:desc"

let timerId
function queryHook(query, search) {
  if (timerId) {
    clearTimeout(timerId)
  }

  timerId = setTimeout(() => search(query), 200)
}

export default function SearchPage({}) {
  // NOTE docs here https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/
  const head = (
    <Head>
      <title>{`Caută anunțuri în Rădăuți`}</title>
    </Head>
  )

  return (
    <>
      {head}
      <div className="prose mb3 mb-4">
        <h1 className="text-2xl text-base-content">Căutare</h1>
      </div>
      <InstantSearch
        routing={{
          router: createInstantSearchRouterNext({
            singletonRouter,
            serverUrl: process.env.NEXT_PUBLIC_APP_URL,
          }),
        }}
        indexName="Post"
        searchClient={searchClient}
      >
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
            queryHook={queryHook}
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

const Hit = ({ hit, index }) => {
  // return <pre>{JSON.stringify(props, null, 2)}</pre>
  // console.log(hit.updatedTimestamp)
  const post = hit as PostWithIncludes
  return (
    <div className="mb-2" style={{ opacity: 0, animation: animStr(index) }}>
      <PostCell post={post} />
    </div>
  )
}

const duration = 200 // ms
const delay = 100 // ms
const animStr = (i) => `${styles.fadeIn} ${duration}ms ease-out ${delay * i}ms forwards`

// NOTE see https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/infinite-scroll/react/
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
  const sentinelRef = useRef(null)
  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore()
          }
        })
      })

      observer.observe(sentinelRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [isLastPage, showMore])

  const isInitial = results?.query === ""

  return (
    <>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {isInitial
          ? null
          : items.map((item, index) => <Hit key={item.id} hit={item} index={index % 3} />)}
      </div>
      {/* <div ref={sentinelRef} aria-hidden="true" /> */}
      {isInitial ? null : (
        <button
          disabled={isLastPage}
          onClick={showMore}
          className="btn btn-primary block w-full mt-4"
        >
          Mai multe rezultate...
        </button>
      )}
    </>
  )
}

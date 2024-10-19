import Layout from "src/core/layouts/Layout"

import dayjs from "dayjs"
import { createInfiniteHitsSessionStorageCache } from "instantsearch.js/es/lib/infiniteHitsCache"
import Head from "next/head"
import singletonRouter, { useRouter } from "next/router"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  InstantSearch,
  SearchBox,
  SortBy,
  useInfiniteHits,
  useInstantSearch,
  useRange,
  useStats,
} from "react-instantsearch"
import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs"
import useScrollPosition from "src/core/hooks/useScrollPosition"
import { formatDate } from "src/helpers"
import { searchClient } from "src/meili/client"
import PostCell from "src/posts/components/PostCell/PostCell"
import { PostWithIncludes } from "src/posts/helpers"
import styles from "./search.module.css"
import { RangeMin } from "instantsearch.js/es/connectors/range/connectRange"
import Link from "next/link"
import Delayed from "src/core/components/Delayed"

const DEFAULT_SORT = "Post:updatedTimestamp:desc"
const sessionStorageCache = createInfiniteHitsSessionStorageCache()

const SCROLL_POSITION_KEY = "meilisearch_scroll"

let timerId
function queryHook(query, search) {
  if (timerId) {
    clearTimeout(timerId)
  }

  timerId = setTimeout(() => search(query), 200)
}

const isSearchPageActive = () => window.location.pathname === "/cautare"

function SearchPageInner({}) {
  const { nbHits, processingTimeMS, query } = useStats()

  const head = (
    <Head>
      <title>{`Caută anunțuri în Rădăuți`}</title>
    </Head>
  )

  return (
    <>
      {head}
      <div className="">
        <div className="flex flex-column flex-wrap place-items-center w-full pb-4">
          <div className="flex">
            <h1 className="not-prose font-extrabold text-2xl text-base-content">
              <Link className="link link-hover text-accent " href={"/cautare"}>
                <span className="">{`Căutare`}</span>
              </Link>{" "}
            </h1>
          </div>
          <div className="flex pl-4">
            <RangeInput attribute="updatedTimestamp" />
          </div>
        </div>
      </div>

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
          autoFocus={true}
          spellCheck="true"
          queryHook={queryHook}
          classNames={{
            input: "w-full p-4 mb-4",
            form: "",
            reset: "hidden",
            submit: "hidden",
          }}
        />

        <CustomInfiniteHits cache={sessionStorageCache} />
      </div>
    </>
  )
}

export default function SearchPage({}) {
  const restoreScroll = useScrollPosition(SCROLL_POSITION_KEY, isSearchPageActive)
  useLayoutEffect(restoreScroll, [])
  // NOTE docs here https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/
  const nextRouter = useRouter()
  const router = createInstantSearchRouterNext({
    singletonRouter,
    serverUrl: process.env.NEXT_PUBLIC_APP_URL,
    routerOptions: {
      cleanUrlOnDispose: false,
      push: (url) => {
        console.log(`🚀 ~ SearchPage ~ url:`, url)
        // Use replaceState instead of pushState to avoid adding to history
        nextRouter.replace(url, url, { scroll: false }).catch(console.error)
      },
    },
  })

  return (
    <InstantSearch
      future={{ preserveSharedStateOnUnmount: true }}
      routing={{
        router,
      }}
      indexName="Post"
      searchClient={searchClient}
    >
      <SearchPageInner />
    </InstantSearch>
  )
}
SearchPage.getLayout = (page) => <Layout>{page}</Layout>

// Custom Range Input Component
const RangeInput = ({ attribute }: { attribute: string }) => {
  const { range, start, canRefine, refine } = useRange({ attribute })

  const lastYear = dayjs().subtract(2, "year").unix()
  const lastMonth = dayjs().subtract(1, "month").unix()
  const last3Months = dayjs().subtract(3, "month").unix()
  const last6Months = dayjs().subtract(6, "month").unix()

  const [st, minv, ly] = [start[0], start[1], lastYear].map((v) =>
    !v ? null : dayjs(v * 1000).format(formatDate.longDateTime)
  )

  console.log(`🚀 ~ RangeInput`, start, st, minv, ly)

  const opts = [
    { label: "Toate", value: "ALL" },
    { label: "Mai noi de 31 de zile", value: lastMonth },
    { label: "Mai noi de 3 luni", value: last3Months },
    { label: "Mai noi de 6 luni", value: last6Months },
    { label: "Mai noi de un an", value: lastYear },
  ]

  function findClosestOpt(timestamp: RangeMin) {
    console.log(`🚀 ~ findClosestOpt ~ timestamp:`, timestamp)
    let retVal = opts[0]
    if (!timestamp || timestamp === -Infinity) {
      return retVal
    }
    let currDistance = +Infinity

    opts.forEach((o) => {
      if (o.value === "ALL") {
        return
      }
      let diff = Math.abs(timestamp - Number(o.value))
      if (diff < currDistance) {
        currDistance = diff
        console.log(`🚀 ~ opts.forEach ~ new currDistance:`, currDistance, o)
        retVal = o
      }
    })
    return retVal
  }
  const selected = findClosestOpt(start[0])
  console.log(`🚀 ~ RangeInput ~ selected:`, selected)

  const labelProps = {
    className:
      "label inline mr-2 text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-1",
  }
  const outerProps = { className: "flex flex-col text-0xl" }

  return (
    <div>
      {/* <label className={labelProps.className} htmlFor="timestampFilter">
        Filtru:
      </label> */}
      <select
        value={selected?.value}
        id="timestampFilter"
        onChange={(e) =>
          refine([e.target.value === "ALL" ? undefined : Number(e.target.value), undefined])
        }
        className="select input-bordered bg-base-200 focus:outline-secondary-focus"
      >
        {opts.map((o) => {
          return (
            <option key={o.label} value={o.value}>
              {o.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

const Hit = ({ hit, index }) => {
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
  const { status } = useInstantSearch()
  console.log(`🚀 ~ CustomInfiniteHits ~ results:`, results)
  let isLoading = false
  if (status === "loading" || status === "stalled") {
    isLoading = true
  }
  console.log(`🚀 ~ CustomInfiniteHits ~ status:`, status)
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

  // const isInitial = results?.query === ""
  const isInitial = false
  const noResults = (
    <Delayed waitBeforeShow={500}>
      <div className="prose">
        <h2 className="not-prose text-2xl text-error mb-4">{`Nu sunt rezultate 🙁`}</h2>
        <p>🛈 Puteți alege un alt filtru </p>
        <p>🛈 Puteți încerca cuvinte mai puține și/sau să verificați dacă ați scris corect </p>
      </div>
    </Delayed>
  )

  return (
    <>
      {!isLoading && results?.nbHits === 0 ? noResults : null}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {items.map((item, index) => (
          <Hit key={item.id} hit={item} index={index % 3} />
        ))}
      </div>
      <div ref={sentinelRef} aria-hidden="true" />
      {isInitial || results?.nbHits === 0 ? null : (
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

import { Routes } from "@blitzjs/next"
import { Image, PostStatuses } from "@prisma/client"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { gSSP } from "src/blitz-server"
import SimpleNav from "src/core/components/SimpleNav"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import Layout from "src/core/layouts/Layout"
import PostCell from "src/posts/components/PostCell/PostCell"
import { PostWithIncludes, getImagesPreloadLinks } from "src/posts/helpers"
import getCategories from "src/posts/queries/getCategories"
import getPaginatedPosts from "src/posts/queries/getPaginatedPosts"
import getPost from "src/posts/queries/getPost"
import { makePostNavUrl } from "../anunt/[[...params]]"

const ITEMS_PER_PAGE = 12

export const makePostsNavUrl = (categorySlug: string, page: number = 1) => {
  return `/anunturi/${categorySlug}${page === 1 ? "" : "/pagina-" + page}`
}

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx, res } = args
  res.setHeader("Cache-Control", `public, max-age=${3600}, stale-while-revalidate=59`)
  const params = query.params as string[]
  console.log(`🚀 ~ getServerSideProps ~ params:`, params)
  const categorySlug = params[0]
  const pageSlug = params[1] || null
  const parts = pageSlug?.split("-") || ""
  const page = Number(parts.length ? parts[parts.length - 1] : 1)

  //old url segment catName-catID
  const normalizedSlug = categorySlug?.replace(/-\d+$/, "") || ""
  console.log(`🚀 ~ getServerSideProps ~ normalizedSlug:`, normalizedSlug)
  const categories = await getCategories({ where: { slug: normalizedSlug } }, ctx)
  if (categories.length !== 1) {
    return {
      notFound: true,
    }
  }
  const category = categories[0]

  // is this a page-pageNum or an old url /anunturi/catName-catID/postDlug-postID?
  if (pageSlug && !/^pagina-\d+$/.test(pageSlug)) {
    console.log(` old Post redirect ${page}`)
    const postId = page
    const post = await getPost({ id: page }, ctx)
    const postUrl = makePostNavUrl(post)
    console.log(`🚀 ~ getServerSideProps ~ postUrl:`, postUrl)
    return {
      redirect: {
        destination: postUrl,
        permanent: true,
      },
    }
  }
  //old url /anunturi/catName-catID/pagina-pageNum
  if (categorySlug !== normalizedSlug) {
    console.log(`redirect: ${categorySlug} => ${normalizedSlug}`)
    return {
      redirect: {
        destination: makePostsNavUrl(normalizedSlug, page),
        permanent: true,
      },
    }
  }

  const { posts, count, hasMore, numPages, permissions } = await getPaginatedPosts(
    {
      // NOTE category is logically there
      // @ts-ignore
      where: { categoryId: category.id, status: { not: PostStatuses.EXPIRED } },
      orderBy: { updatedAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    },
    ctx
  )
  if (page > numPages && numPages > 0) {
    return {
      notFound: true,
    }
  }

  return { props: { category, posts, count, hasMore, page, numPages, permissions } }
})

export { SimpleNav }

export default function PostsNavPage({ category, posts, page, hasMore, numPages }) {
  const router = useRouter()

  const prevPageURL = makePostsNavUrl(category.slug, page - 1)
  const nextPageURL = makePostsNavUrl(category.slug, page + 1)

  const title = `Anunţuri: ${category.title} p.${page} | eRădăuţi `
  const description = `eRădăuţi Anunţuri: ${category.title} p.${page} ${category.description} `
  const hasPrev = page > 1
  const images = posts.reduce((acc: Image[], p: PostWithIncludes) => {
    if (p.images[0]) {
      acc.push(p.images[0])
    }
    return acc
  }, [])
  const imagePreloadLinks = getImagesPreloadLinks(images)
  const head = (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {imagePreloadLinks}
    </Head>
  )

  if (numPages === 0) {
    return (
      <ViewportCentered>
        <div className="text-2xl">
          <h1 className="block mb-4">
            Nu sunt anunţuri deocamdată în categoria „{category.title}”
          </h1>
          <div className="flex w-fit mx-auto">
            <div className="grid h-20 flex-grow card rounded-box place-items-center">
              <Link className="btn btn-secondary" href={Routes.Home()}>
                Vezi toate anunţurile
              </Link>
            </div>
            <div className="divider divider-horizontal px-6">sau</div>
            <div className="grid h-20 flex-grow card rounded-box place-items-center">
              <Link className="btn btn-primary" href={Routes.NewPostPage()}>
                Publică un anunţ
              </Link>
            </div>
          </div>
        </div>
      </ViewportCentered>
    )
  }

  return (
    <>
      {head}
      <div className="font-extrabold text-2xl mb-4 flex flex-row flex-wrap">
        <h1 className="flex-grow">
          <Link className="link link-hover text-accent " href={Routes.Home()}>
            Anunţuri
          </Link>
          {" > "}
          {category.title}
        </h1>
        <span className="flex-none text-neutral-content">
          p. {page}/{numPages}
        </span>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 `}>
        {posts.map((post) => (
          <PostCell key={post.id} post={post} />
        ))}
      </div>
      <SimpleNav
        {...{ prevLink: hasPrev ? prevPageURL : null, nextLink: hasMore ? nextPageURL : null }}
      />
    </>
  )
}
PostsNavPage.getLayout = (page) => <Layout>{page}</Layout>

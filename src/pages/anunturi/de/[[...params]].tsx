import { Routes } from "@blitzjs/next"
import { User } from "@prisma/client"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { gSSP } from "src/blitz-server"
import SimpleNav from "src/core/components/SimpleNav"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import Layout from "src/core/layouts/Layout"
import { makeSlug } from "src/helpers"
import PostCell from "src/posts/components/PostCell/PostCell"
import getPosts from "src/posts/queries/getPosts"
import getUser from "src/users/queries/getUser"

const ITEMS_PER_PAGE = 12

export const makePostsByAuthorNavUrl = (author: User, page: number = 1) => {
  const slug = makeSlug(author.fullName || "rădăuţean")
  return `/anunturi/de/${slug}-${author.id}/${page === 1 ? "" : "/pagina-" + page}`
}

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx } = args
  const params = query.params as string[]
  console.log(`🚀 ~ getServerSideProps ~ params:`, params)
  const authorSlug = params[0] || ""

  let authorId: any = authorSlug.substring(authorSlug.lastIndexOf("-") + 1)
  authorId = parseInt(authorId)
  const author = await getUser({ id: authorId }, ctx)

  const pageSlug = params[1] || null
  const page = Number(pageSlug?.split("-")[1] || 1)

  const { posts, count, hasMore, numPages } = await getPosts(
    {
      // @ts-ignore
      where: { userId: authorId },
      orderBy: { createdAt: "desc" },
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

  const ret = { props: { author, posts, count, hasMore, page, numPages } }
  console.log(`🚀 ~ getServerSideProps ~ ret:`, ret)
  return ret
})

export { SimpleNav }

export default function PostsByAuthorNavPage({ author, posts, page, hasMore, numPages }) {
  const router = useRouter()
  // return <>PENDING</>

  const prevPageURL = makePostsByAuthorNavUrl(author, page - 1)
  const nextPageURL = makePostsByAuthorNavUrl(author, page + 1)

  const title = `Anunţuri de ${author.fullName} p.${page} | eRădăuţi `
  const description = `eRădăuţi Anunţuri de ${author.fullName} p.${page}`
  const hasPrev = page > 1
  const head = (
    <Head>
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
    </Head>
  )

  if (numPages === 0) {
    return (
      <ViewportCentered>
        <div className="text-2xl">
          <h1 className="block mb-4">{author.fullName} nu a pubicat anunţuri deocamdată”</h1>
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
          <Link className="link link-hover text-accent-focus " href={Routes.Home()}>
            Anunţuri
          </Link>
          {" > de "}
          {author.fullName}
        </h1>
        <span className="flex-none text-neutral-content">
          p. {page}/{numPages}
        </span>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 `}>
        {/* NOTE spreading post for fast refresh in dev mode */}
        {posts.map((post) => (
          <PostCell key={post.id} post={{ ...post }} />
        ))}
      </div>
      <SimpleNav
        {...{ prevLink: hasPrev ? prevPageURL : null, nextLink: hasMore ? nextPageURL : null }}
      />
    </>
  )
}
PostsByAuthorNavPage.getLayout = (page) => <Layout>{page}</Layout>

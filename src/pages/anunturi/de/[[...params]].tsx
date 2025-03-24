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
import getPaginatedPosts from "src/posts/queries/getPaginatedPosts"
import getCurrentUser from "src/users/queries/getCurrentUser"
import getUser from "src/users/queries/getUser"

const ITEMS_PER_PAGE = 12
type RouteUser = Pick<User, "id" | "fullName">

export const getPostsByAuthorNavUrl = (author: RouteUser, page: number = 1) => {
  const slug = makeSlug(author.fullName || "rădăuţean")
  return `/anunturi/de/${slug}-${author.id}${page === 1 ? "" : "/pagina-" + page}`
}

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx, res } = args
  const params = query.params as string[]
  console.log(`🚀 ~ getServerSideProps ~ params:`, params)

  if (params.length > 2) {
    res.statusCode = 400
    res.end("Malformed URI")
    // return type must match GSSP type signature but this does not, in fact, count
    return {
      notFound: true,
    }
  }

  const authorSlug = params[0] || ""

  let authorId: any = authorSlug.substring(authorSlug.lastIndexOf("-") + 1)
  authorId = parseInt(authorId)
  let author
  try {
    author = await getUser({ id: authorId }, ctx)
  } catch (error) {
    if (!author) {
      return {
        notFound: true,
      }
    }
  }

  const currentUser = await getCurrentUser(null, ctx)

  const pageSlug = params[1] || null
  const page = Number(pageSlug?.split("-")[1] || 1)

  const { posts, count, hasMore, numPages } = await getPaginatedPosts(
    {
      // @ts-ignore
      where: { userId: authorId },
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

  const ret = { props: { currentUser, author, posts, count, hasMore, page, numPages } }
  console.log(`🚀 ~ getServerSideProps ~ ret:`, ret)
  return ret
})

export { SimpleNav }

export default function PostsByAuthorNavPage({
  currentUser,
  author,
  posts,
  page,
  hasMore,
  numPages,
}) {
  const router = useRouter()
  // return <>PENDING</>

  const prevPageURL = getPostsByAuthorNavUrl(author, page - 1)
  const nextPageURL = getPostsByAuthorNavUrl(author, page + 1)

  const title = `Anunţuri de ${author.fullName} p.${page} | eRădăuţi `
  const description = `eRădăuţi Anunţuri de ${author.fullName} p.${page}`
  const hasPrev = page > 1
  const head = (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  )

  if (numPages === 0) {
    let message = `${author.fullName} nu a publicat anunţuri deocamdată`
    if (author.id === currentUser.id) {
      message = `${author.fullName}, nu ai publicat anunţuri deocamdată`
    }
    return (
      <ViewportCentered>
        <div className="text-2xl">
          <h1 className="block mb-4">{message}</h1>
          <div className="flex w-fit mx-auto">
            <div className="grid h-20 flex-grow card rounded-box place-items-center">
              <Link className="btn btn-primary" href={Routes.NewPostPage()}>
                Publică un anunţ
              </Link>
            </div>
            <div className="divider divider-horizontal px-6">sau</div>
            <div className="grid h-20 flex-grow card rounded-box place-items-center">
              <Link className="btn btn-secondary" href={Routes.Home()}>
                Vezi toate anunţurile
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

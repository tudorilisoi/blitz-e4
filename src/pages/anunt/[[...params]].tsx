import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { Category, Image, PostStatuses, Prisma } from "@prisma/client"
import { Award, Mail, Phone } from "lucide-react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { gSSP } from "src/blitz-server"
import { nextSymbol, prevSymbol } from "src/core/components/SimpleNav"
import ImageGallery from "src/core/components/image/ImageGallery"
import { OGImage } from "src/core/components/image/OGImage"
import { getImageUrl } from "src/core/components/image/helpers"
import Layout from "src/core/layouts/Layout"
import { S, canonical, formatDate, shortenText } from "src/helpers"
import { PostWithIncludes, getImagesPreloadLinks } from "src/posts/helpers"
import deletePost from "src/posts/mutations/deletePost"
import promotePost from "src/posts/mutations/promotePost"
import getCategories from "src/posts/queries/getCategories"
import { PermissionFlags } from "src/posts/queries/getPermissions"
import getPosts from "src/posts/queries/getPosts"
import { SimpleNav, makePostsNavUrl } from "../anunturi/[[...params]]"
import { getPostsByAuthorNavUrl } from "../anunturi/de/[[...params]]"

export const makePostNavUrl = (post: PostWithIncludes) => {
  const { slug, id } = post
  return `/anunt/${post.category.slug}/${slug}-${id}`
}

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx, res } = args
  res.setHeader("Cache-Control", `public, max-age=${3600 * 24 * 31}, stale-while-revalidate=59`)
  const params = query.params as string[]
  const postSlug = params[1] || ""
  const postId = Number(postSlug.substring(postSlug.lastIndexOf("-") + 1))
  const categorySlug = params[0]
  const categories = await getCategories({ where: { slug: categorySlug } }, ctx)
  if (categories.length !== 1) {
    return {
      notFound: true,
    }
  }
  const category = categories[0]

  const { posts, permissions } = await getPosts(
    {
      where: { id: postId },
      take: 1,
      skip: 0,
    },
    ctx,
  )
  if (posts.length === 0) {
    return {
      notFound: true,
    }
  }
  const post = posts[0]

  const cArgs = {
    cursor: { id: post?.id },
    take: -1,
    skip: 1,
    where: {
      status: { not: PostStatuses.EXPIRED },
      categoryId: post?.categoryId,
    },
    orderBy: { updatedAt: "desc" } as Prisma.PostOrderByWithRelationInput,
  }

  const { posts: prevPosts } = await getPosts(cArgs, ctx)
  const { posts: nextPosts } = await getPosts({ ...cArgs, take: 1 }, ctx)

  const prevPost = prevPosts.length == 1 ? prevPosts[0] : null
  const nextPost = nextPosts.length == 1 ? nextPosts[0] : null

  return {
    props: {
      category,
      post,
      permissionFlags: permissions[postId],
      prevPost,
      nextPost,
    },
  }
})

export default function PostPage({
  category,
  post,
  permissionFlags,
  nextPost,
  prevPost,
}: {
  category: Category
  post: PostWithIncludes
  permissionFlags: PermissionFlags
  prevPost: PostWithIncludes | null
  nextPost: PostWithIncludes | null
}) {
  const router = useRouter()
  const [deleteMutation] = useMutation(deletePost)
  const [promoteMutation, { isLoading }] = useMutation(promotePost)
  const deletePostFn = async () => {
    if (window.confirm("Ștergeți definitiv acest anunț?")) {
      await deleteMutation({ id: post.id })
      router.push(getPostsByAuthorNavUrl(post.author)).catch(() => {})
    }
  }
  const isPromoted = post.promotionLevel > 0
  const promotePostFn = async () => {
    await promoteMutation({ id: post.id })
    // TODO refresh
    await router.replace(router.asPath)
  }
  const sanitizedBody = S(post.body).obscurePhoneNumbers().get()

  const title = `Anunţ: ${post.title} | ${category.title} | eRădăuţi `
  const description = `${S(sanitizedBody).shortenText(200).get()}`
  const ogImage = OGImage(post.images[0] ?? null)

  const canonicalUrl = canonical(makePostNavUrl(post))
  let preloadPosts: PostWithIncludes[] = []
  if (nextPost) {
    preloadPosts.unshift(nextPost)
  }
  if (prevPost) {
    preloadPosts.push(prevPost)
  }
  //high priority
  preloadPosts.unshift(post)

  const images = preloadPosts.reduce((acc: Image[], p: PostWithIncludes) => {
    if (p.images.length) {
      acc = [...acc, ...p.images]
    }
    return acc
  }, [])
  const imagePreloadLinks = getImagesPreloadLinks(images)

  const ContactInfo = ({ post }: { post: PostWithIncludes }) => {
    // TODO P0 just show expired info
    const [show, setShow] = useState(false)
    if (!show) {
      return (
        <button
          rel="nofollow"
          onClick={() => setShow(true)}
          className="btn btn-accent btn-responsive"
        >
          {`Informaţii de contact`}
        </button>
      )
    }
    const phone = post.phone || post.author.phone
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a className="btn flex-grow btn-secondary" href={`tel://${phone}`}>
          <Phone className="h-8 w-8" />
          {phone}
        </a>
        <a className="btn flex-grow btn-secondary" href={`mailto:${post.author.email}`}>
          <Mail className="h-8 w-8" />
          {`email: ${post.author.email}`}
        </a>
      </div>
    )
  }

  const head = (
    <Head>
      <title>{title}</title>
      <link rel="canonical" content={canonicalUrl} />
      <meta name="description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={shortenText(title, 60, "")} />
      <meta property="og:description" content={shortenText(description, 160, "")} />
      {ogImage}
      <meta property="og:type" content="article" />
      <meta
        property="article:modified_time"
        content={formatDate(post.updatedAt, formatDate.ISO)}
      ></meta>
      <meta
        property="article:published_time"
        content={formatDate(post.createdAt, formatDate.ISO)}
      ></meta>
      <meta property="article:section" content={`${post.category.title}`} />
      <meta property="article:tag" content={`${post.category.title}`} />
      <meta property="article:tag" content={`eRădăuţi`} />
      <meta property="article:tag" content={`Rădăuţi`} />
      <meta property="article:tag" content={`Suceava`} />
      <meta property="article:tag" content={`Anunţuri`} />
      {imagePreloadLinks}
    </Head>
  )
  const pagination = (
    <SimpleNav
      nextLink={nextPost ? makePostNavUrl(nextPost) : null}
      prevLink={prevPost ? makePostNavUrl(prevPost) : null}
      prevText={
        <span className="flex-grow" title={prevPost?.title || ""}>
          {prevSymbol}Anunţul anterior
        </span>
      }
      nextText={
        <span className="flex-grow" title={nextPost?.title || ""}>
          Anunţul următor{nextSymbol}
        </span>
      }
    />
  )

  // NOTE using microformat classes such as h-product
  // see https://microformats.org/wiki/h-product
  // also using microdata https://en.wikipedia.org/wiki/Microdata_(HTML) like itemScope itemProp

  const mfImageSrc = post.images[0] ? getImageUrl(post.images[0], true) : "/logo.png"
  const mfImage = (
    <img itemProp="image" alt={post.title} className="u-photo hidden" src={canonical(mfImageSrc)} />
  )

  let promoBtnText
  switch (true) {
    case isLoading:
      promoBtnText = "Un moment..."
      break
    case post.promotionLevel !== 0:
      promoBtnText = "Depromovează"
      break
    default:
      promoBtnText = "Promovează"
      break
  }

  const editButtons = !permissionFlags.mayEdit ? null : (
    <div className="flex flex-row flex-wrap mb-4 mt-4">
      {!permissionFlags.mayEdit ? null : (
        <div className="pr-6">
          <Link className="btn btn-primary" href={Routes.EditPostPage({ postId: post.id })}>
            Modifică
          </Link>
        </div>
      )}
      {!permissionFlags.mayDelete ? null : (
        <div className="pr-6">
          <button className="btn btn-error" onClick={deletePostFn}>
            Șterge
          </button>
        </div>
      )}
      {!permissionFlags.mayPromote ? null : (
        <div className="pr-6">
          <button className="btn btn-secondary" onClick={promotePostFn}>
            {promoBtnText}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div itemScope itemType="http://schema.org/Product" className="h-product">
      {head}
      <div className="flex flex-col sm:flex-row mb-4">
        <div className="flex-grow mb-4">
          <div className="prose">
            <h1 className="not-prose font-extrabold text-2xl text-base-content">
              <Link
                className="link link-hover text-accent "
                href={makePostsNavUrl(post.category.slug)}
              >
                <span className="p-category">{post.category.title}</span>
              </Link>{" "}
              <span itemProp="name" className="p-name">
                {post.title}
              </span>
            </h1>
            {editButtons}

            <p className="text-lg text-base-content whitespace-pre-line	">
              <span className="inline-block bg-neutral text-neutral-content p-2 mr-2 rounded text-sm ">
                {formatDate(post.updatedAt, formatDate.short)}
              </span>

              <span
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
                className={` ${
                  !post.price ? "hidden" : ""
                } p-price inline-block font-bold bg-slate-400 text-slate-950 p-2 mx-2 rounded text-sm `}
              >
                <span itemProp="price" content={"" + post.price}>
                  {post.price}
                </span>{" "}
                <span itemProp="priceCurrency" content={post.currency}>
                  {post.currency}
                </span>
              </span>

              {!isPromoted ? null : (
                <span className="mt-2 block text-md text-red-500 ">
                  <span className="inline-flex items-center">
                    <Award className="inline-block h-8 mr-1 p-0" />
                    <span>Anunț promovat</span>
                    <Link
                      className="ml-2 text-secondary"
                      href="/static-page/despre-anunturile-promovate"
                    >
                      află mai multe
                    </Link>
                  </span>
                </span>
              )}

              <span itemProp="description" className="e-description block mt-0">
                {sanitizedBody}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className={post.images.length == 1 ? "max-w-[480px]" : ""}>
        <ImageGallery images={post.images} />
      </div>

      <div className="my-6">
        <ContactInfo post={post} />
        <span className="block my-4">
          Anunţ publicat de{" "}
          <Link href={getPostsByAuthorNavUrl(post.author)} className="font-bold text-accent">
            {post.author.fullName}
          </Link>
        </span>
      </div>

      {pagination}
      {mfImage}
    </div>
  )
}
PostPage.getLayout = (page) => <Layout>{page}</Layout>

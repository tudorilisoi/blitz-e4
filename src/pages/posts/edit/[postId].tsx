import { Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Suspense } from "react"

import { useOverlay } from "src/core/components/spinner/OverlayProvider"
import Spinner from "src/core/components/spinner/Spinner"
import Layout from "src/core/layouts/Layout"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { FORM_ERROR, PostForm } from "src/posts/components/PostForm"
import updatePost from "src/posts/mutations/updatePost"
import getCategories from "src/posts/queries/getCategories"
import getPost from "src/posts/queries/getPost"
import { UpdatePostSchema } from "src/posts/schemas"

export const EditPost = () => {
  const router = useRouter()
  const { toggle } = useOverlay()
  const postId = useParam("postId", "number")
  const [post, { setQueryData }] = useQuery(
    getPost,
    { id: postId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updatePostMutation] = useMutation(
    updatePost,
    // {},
    {
      onMutate: () => {
        toggle(true)
      },
      onSettled: () => {
        toggle(false)
      },
    }
  )
  const [categories, error] = useQuery(
    getCategories,
    { orderBy: { title: "asc" } },
    { suspense: true, staleTime: Infinity }
  )

  return (
    <>
      <Suspense fallback={Spinner()}>
        <Head>
          <title>Edit Post {post.id}</title>
        </Head>

        <>
          <h1 className="text-3xl pb-4">Modifică anunţ</h1>

          <PostForm
            categories={categories || []}
            submitText="Update Post"
            schema={UpdatePostSchema}
            initialValues={{ ...post, blobs: "" }}
            onSubmit={async (values) => {
              console.log(`🚀 ~ onSubmit={ ~ values:`, values)
              const { blobs, ...otherValues } = values
              try {
                const updated = await updatePostMutation({
                  ...otherValues,
                  blobs: {},
                  id: post.id,
                })
                const category = categories?.find((c) => c.id === updated.categoryId)
                await setQueryData(updated)

                //wait for the overlay to unblur
                setTimeout(async () => {
                  await router.push(
                    makePostNavUrl(updated.slug, category?.slug || "NX", updated.id)
                  )
                }, 300)
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </>
        {/* <pre>{JSON.stringify(post, null, 2)}</pre> */}
      </Suspense>
    </>
  )
}

const EditPostPage = () => {
  // return <Loading />
  return (
    <Suspense fallback={Spinner()}>
      <div className="max-w-4xl">
        <EditPost />

        <p>
          <Link href={Routes.PostsPage()}>Posts</Link>
        </p>
      </div>
    </Suspense>
  )
}

EditPostPage.authenticate = true
EditPostPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditPostPage

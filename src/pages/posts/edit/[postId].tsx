import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { UpdatePostSchema } from "src/posts/schemas"
import getPost from "src/posts/queries/getPost"
import updatePost from "src/posts/mutations/updatePost"
import { PostForm, FORM_ERROR } from "src/posts/components/PostForm"
import getCategories from "src/posts/queries/getCategories"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { Watch } from "react-loader-spinner"
import Spinner from "src/core/components/spinner/Spinner"
import { useOverlay } from "src/core/components/spinner/OverlayProvider"

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

        <div>
          <h1 className="text-3xl pb-4">Modifică anunţ</h1>

          <PostForm
            categories={categories || []}
            submitText="Update Post"
            schema={UpdatePostSchema}
            initialValues={post}
            onSubmit={async (values) => {
              try {
                const updated = await updatePostMutation({
                  ...values,
                  id: post.id,
                })
                const category = categories?.find((c) => c.id === updated.categoryId)
                await setQueryData(updated)
                await router.push(makePostNavUrl(updated.slug, category?.slug || "NX", updated.id))
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </div>
        {/* <pre>{JSON.stringify(post, null, 2)}</pre> */}
      </Suspense>
    </>
  )
}

const EditPostPage = () => {
  // return <Loading />
  return (
    <Suspense fallback={Spinner()}>
      <EditPost />

      <p>
        <Link href={Routes.PostsPage()}>Posts</Link>
      </p>
    </Suspense>
  )
}

EditPostPage.authenticate = true
EditPostPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditPostPage

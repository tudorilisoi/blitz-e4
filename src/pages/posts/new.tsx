import { Routes } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { FORM_ERROR, PostForm } from "src/posts/components/PostForm"
import createPost from "src/posts/mutations/createPost"
import getCategories from "src/posts/queries/getCategories"
import { CreatePostSchema } from "src/posts/schemas"

const NewPostPage = () => {
  const router = useRouter()
  //NOTE wihtout suspense:false this fails with  DYNAMIC_SERVER_USAGE
  const [categories, error] = useQuery(
    getCategories,
    { orderBy: { title: "asc" } },
    { suspense: false, staleTime: Infinity }
  )
  const [createPostMutation] = useMutation(createPost)

  return (
    <Layout title={"Create New Post"}>
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Publică anunţ</h1>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <PostForm
          categories={categories || []}
          submitText="Create Post"
          schema={CreatePostSchema}
          initialValues={{}}
          onSubmit={async (values) => {
            try {
              const post = await createPostMutation(values)
              await router.push(Routes.ShowPostPage({ postId: post.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </Suspense>
      {/* <p>
        <Link href={Routes.PostsPage()}>Posts</Link>
      </p> */}
    </Layout>
  )
}

// NewPostPage.authenticate = true

export default NewPostPage

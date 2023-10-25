import { useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { FaceSmileIcon } from "@heroicons/react/24/outline"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Suspense, useEffect, useState } from "react"
import { ErrorNotification } from "src/core/components/ErrorNotification"
import { BlobsState } from "src/core/components/image/UploadGrid"

import { useOverlay } from "src/core/components/spinner/OverlayProvider"
import Spinner, { messageClassName } from "src/core/components/spinner/Spinner"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import Layout from "src/core/layouts/Layout"
import createImage from "src/images/mutations/createImage"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { FORM_ERROR, PostForm } from "src/posts/components/PostForm"
import { PostWithIncludes } from "src/posts/helpers"
import updatePost from "src/posts/mutations/updatePost"
import getCategories from "src/posts/queries/getCategories"
import getPost from "src/posts/queries/getPost"
import { UpdatePostSchema } from "src/posts/schemas"

const SuccessNotification = ({ post, ...props }: { post: PostWithIncludes }) => {
  const { toggle } = useOverlay()

  return (
    <ViewportCentered>
      <div className="min-w-fit max-w-3xl mx-auto">
        <div className="text-center">
          <FaceSmileIcon className="h-[104px] w-[104px] inline-block text-success-content" />
        </div>
        <h2 className={messageClassName}>{"Anunţul a fost modificat!"}</h2>
        <div className="flex flex-wrap mt-4 px-6 gap-6 place-items-center">
          <Link className={"grow-2"} onClick={() => toggle(false)} href={makePostNavUrl(post)}>
            <button className="btn btn-primary w-full">Mergi la anunţ</button>
          </Link>
          <div className="grow-1 mx-auto">
            <button onClick={() => toggle(false)} className="btn btn-secondary">
              Modifică din nou
            </button>
          </div>
        </div>
      </div>
    </ViewportCentered>
  )
}

export const EditPost = () => {
  const [blobs, setBlobs] = useState({} as BlobsState)
  const router = useRouter()
  const { toggle, reset } = useOverlay()
  const postId = useParam("postId", "number")
  const [post, { setQueryData, remove, refetch, ...other }] = useQuery(
    getPost,
    { id: postId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updatePostMutation] = useMutation(updatePost)

  const [createImageMutation] = useMutation(createImage)

  const [categories, error] = useQuery(
    getCategories,
    { orderBy: { title: "asc" } },
    { suspense: true, staleTime: Infinity }
  )

  useEffect(() => {
    // refetch on mount
    console.log("MOUNT", other)
    refetch().catch(() => null)
  }, [])

  return (
    <>
      <Suspense fallback={Spinner()}>
        <Head>
          <title>Editare: {post.title}</title>
        </Head>

        <div className="prose mb-3">
          <h1 className="text-2xl text-base-content">Modifică anunţ</h1>
        </div>

        <div className="max-w-3xl">
          <PostForm
            onBlobsChange={setBlobs}
            categories={categories || []}
            submitText="Publică"
            schema={UpdatePostSchema}
            initialValues={post}
            onSubmit={async (values) => {
              console.log("Blobs:", blobs)
              toggle(true, reset)
              try {
                const updated = await updatePostMutation({
                  ...values,
                  id: post.id,
                })

                let completedImagecount = 0
                const imageCount = Object.keys(blobs).length
                imageCount &&
                  toggle(true, {
                    component: <Spinner>{`Foto ${0}%`}</Spinner>,
                  })
                const promises = Object.entries(blobs).map(async ([id, blob], idx) => {
                  const image = createImageMutation({
                    fileName: id,
                    blob: blob.blob,
                    postId: updated.id,
                  }).then((image) => {
                    completedImagecount++
                    const percent =
                      completedImagecount === 0
                        ? "0"
                        : ((completedImagecount / imageCount) * 100).toFixed(2)
                    toggle(true, {
                      component: <Spinner>{`Foto ${percent}%`}</Spinner>,
                    })
                    updated.images.unshift(image)
                    delete blobs[id]
                    return image
                  })
                  return image
                })
                await Promise.all(promises)
                const category = categories?.find((c) => c.id === updated.categoryId)
                // NOTE should remove() because we mess with .images
                await remove()
                await setQueryData(updated, { refetch: false })

                toggle(true, {
                  component: <SuccessNotification post={updated} />,
                })
                // toggle(false, { delay: 1500 })
              } catch (error: any) {
                toggle(true, {
                  component: <ErrorNotification {...{ post, error }} />,
                })
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              } finally {
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
      <div className="">
        <EditPost />
      </div>
    </Suspense>
  )
}

EditPostPage.authenticate = true
EditPostPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditPostPage

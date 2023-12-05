import { Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Suspense, useEffect, useState } from "react"
import { ErrorNotification } from "src/core/components/ErrorNotification"
import { BlobsState } from "src/core/components/image/UploadGrid"
import { SuccessIcon } from "src/core/components/notifications"

import {
  messageClassName,
  messageWrapperClassName,
  useOverlay,
} from "src/core/components/overlay/OverlayProvider"
import Spinner from "src/core/components/spinner/Spinner"
import ViewportCentered from "src/core/components/spinner/ViewPortCentered"
import Layout from "src/core/layouts/Layout"
import createImage from "src/images/mutations/createImage"
import { makePostNavUrl } from "src/pages/anunt/[[...params]]"
import { FORM_ERROR, PostForm } from "src/posts/components/PostForm"
import { PostWithIncludes } from "src/posts/helpers"
import createPost from "src/posts/mutations/createPost"
import updatePost from "src/posts/mutations/updatePost"
import getCategories from "src/posts/queries/getCategories"
import getPost from "src/posts/queries/getPost"
import { UpdatePostSchema } from "src/posts/schemas"

export const SuccessNotification = ({
  isNew,
  post,
  ...props
}: {
  isNew: boolean
  post: PostWithIncludes
}) => {
  const router = useRouter()
  const { toggle } = useOverlay()

  let returnToEdit, message
  if (isNew) {
    message = "Anunţul a fost publicat!"
    returnToEdit = async () => {
      toggle(false)
      await router.push(Routes.EditPostPage({ postId: post.id }))
    }
  } else {
    message = "Anunţul a fost modificat!"
    returnToEdit = () => toggle(false)
  }

  return (
    <ViewportCentered>
      <div className={messageWrapperClassName}>
        <div className="text-center">
          <SuccessIcon />
        </div>
        <h2 className={messageClassName}>{message}</h2>
        <div className="flex flex-wrap mt-4 px-6 gap-6 place-items-center">
          <Link className={"grow-2"} onClick={() => toggle(false)} href={makePostNavUrl(post)}>
            <button className="btn btn-secondary w-full">Vezi anunţul</button>
          </Link>
          <div className="grow-1 mx-auto">
            <button onClick={returnToEdit} className="btn btn-primary">
              Modifică anunţul
            </button>
          </div>
        </div>
      </div>
    </ViewportCentered>
  )
}

export const EditPost = () => {
  const [blobs, setBlobs] = useState({} as BlobsState)

  const { toggle, reset } = useOverlay()
  const postId = useParam("postId", "number") || -1
  const isNew = postId === -1

  const [post, { setQueryData, remove, refetch, ...other }] = useQuery(
    getPost,
    { id: postId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [createPostMutation] = useMutation(createPost)
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

  let pageTitle = `Modifică anunţ: ${post.title}`
  let pageHeading = `Modifică anunţ`
  if (isNew) {
    pageTitle = `Publică anunţ`
    pageHeading = `Publică anunţ`
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">{pageHeading}</h1>
      </div>

      <div className="max-w-3xl">
        <PostForm
          onBlobsChange={setBlobs}
          categories={categories || []}
          submitText="Publică"
          schema={UpdatePostSchema}
          initialValues={post}
          onSubmit={async (values) => {
            console.log("PostForm Blobs:", blobs)
            console.log("PostForm Values:", values)
            toggle(true, reset)
            try {
              let updated
              if (post.id > 0) {
                updated = await updatePostMutation({
                  ...values,
                  id: post.id,
                })
              } else {
                updated = await createPostMutation(values)
              }

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
              if (!isNew) {
                await remove()
                await setQueryData(updated, { refetch: false })
              }

              toggle(true, {
                component: <SuccessNotification isNew={isNew} post={updated} />,
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
    </>
  )
}

const EditPostPage = () => {
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

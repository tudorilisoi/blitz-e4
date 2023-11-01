import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { Suspense, useState } from "react"
import { ErrorNotification } from "src/core/components/ErrorNotification"
import { BlobsState } from "src/core/components/image/UploadGrid"
import { useOverlay } from "src/core/components/spinner/OverlayProvider"
import Spinner from "src/core/components/spinner/Spinner"
import Layout from "src/core/layouts/Layout"
import createImage from "src/images/mutations/createImage"
import { FORM_ERROR, PostForm } from "src/posts/components/PostForm"
import createPost from "src/posts/mutations/createPost"
import getCategories from "src/posts/queries/getCategories"
import { CreatePostSchema } from "src/posts/schemas"
import { SuccessNotification } from "./edit/[postId]"
import { currencies } from "@prisma/client"

const NewPostPage = () => {
  const [blobs, setBlobs] = useState({} as BlobsState)
  const { toggle, reset } = useOverlay()
  const router = useRouter()
  //NOTE wihtout suspense:false this fails with  DYNAMIC_SERVER_USAGE
  const [categories, error] = useQuery(
    getCategories,
    { orderBy: { title: "asc" } },
    { suspense: false, staleTime: Infinity }
  )
  const [createPostMutation] = useMutation(createPost)
  const [createImageMutation] = useMutation(createImage)

  const onSubmit = async (values) => {
    console.log("Blobs:", blobs)
    debugger
    // toggle(false, reset)
    toggle(true, reset)
    // return
    try {
      const created = await createPostMutation({
        ...values,
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
          postId: created.id,
        }).then((image) => {
          completedImagecount++
          const percent =
            completedImagecount === 0 ? "0" : ((completedImagecount / imageCount) * 100).toFixed(2)
          toggle(true, {
            component: <Spinner>{`Foto ${percent}%`}</Spinner>,
          })
          created.images.unshift(image)
          delete blobs[id]
          return image
        })
        return image
      })
      await Promise.all(promises)
      const category = categories?.find((c) => c.id === created.categoryId)
      // NOTE should remove() because we mess with .images
      // await remove()
      // await setQueryData(created, { refetch: false })

      toggle(true, {
        component: <SuccessNotification post={created} />,
      })
      // toggle(false, { delay: 1500 })
    } catch (error: any) {
      toggle(true, {
        component: <ErrorNotification {...{ error }} />,
      })
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    } finally {
    }
  }

  const initialValues = {
    title: "sasasaS SA SAS AS AS AS AS AS s ",
    body: "  dfdddasdasd asdas dasd as das das dsad as dsa das da das das d",
    price: 999,
    currency: currencies.RON,
    categoryId: 21,
  }

  return (
    <>
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Publică anunţ</h1>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <PostForm
          onBlobsChange={setBlobs}
          categories={categories || []}
          submitText="Publică anunţ"
          schema={CreatePostSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
        />
      </Suspense>
      {/* <p>
        <Link href={Routes.PostsPage()}>Posts</Link>
      </p> */}
    </>
  )
}

// NewPostPage.authenticate = true
// NOTE: without getLayout the overlay breaks
NewPostPage.getLayout = (page) => <Layout>{page}</Layout>
export default NewPostPage

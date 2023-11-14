import { Suspense } from "react"
import Spinner from "src/core/components/spinner/Spinner"
import Layout from "src/core/layouts/Layout"
import { EditPost } from "./edit/[postId]"

const NewPostPage = () => {
  return (
    <Suspense fallback={Spinner()}>
      <div className="">
        <EditPost />
      </div>
    </Suspense>
  )
}

NewPostPage.authenticate = true
NewPostPage.getLayout = (page) => <Layout>{page}</Layout>

export default NewPostPage

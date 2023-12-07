import Link from "next/link"
import { Suspense, useState } from "react"
import { gSSP } from "src/blitz-server"
import Spinner from "src/core/components/spinner/Spinner"
import Layout from "src/core/layouts/Layout"
import CategoryCell from "src/posts/components/CategoryCell"
import getCategories from "src/posts/queries/getCategories"
import { trpc } from "src/ws-utils/trpc"

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx } = args
  const categories = await getCategories({}, ctx)
  return { props: { categories } }
})

function AboutPage() {
  const [num, setNumber] = useState<number>()
  trpc.randomNumber.useSubscription(undefined, {
    onData(n) {
      setNumber(n)
    },
  })

  return (
    <div>
      Here&apos;s a random number from a sub: {num} <br />
      <Link href="/">Index</Link>
    </div>
  )
}

const Home = ({ categories }) => {
  return (
    <>
      <div className="prose mb-3">
        <h1 className="text-2xl text-base-content">Anunţuri</h1>
      </div>
      <div>
        <Suspense fallback={<Spinner />}>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
            {categories.map((c) => (
              <CategoryCell key={c.id} category={c} />
            ))}
          </div>
        </Suspense>
      </div>
    </>
  )
}
Home.getLayout = (page) => <Layout>{page}</Layout>
export default Home

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
const AD_SRC =
  "https://www.e-suceava.ro/wp-content/uploads/2024/01/Tavidor-firma-recomandata-in-Tamplarie-PVC-si-Aluminiu-de-calitatea-superioara.jpg"
const AD_HREF = "https://www.tavidor.ro/tamplarie-pvc/"
const AD_TITLE = "Tavidor, firmă recomandată în Tâmplărie PVC de calitate superioară"
const Home = ({ categories }) => {
  return (
    <>
      <a
        href={AD_HREF}
        className="block m-auto text-center text-accent  bg-neutral-700 rounded-md pt-4 mb-6"
      >
        <p className="relative inset-0 block mb-2">PROMO: {AD_TITLE}</p>
        <div
          style={{
            width: "100%",
            height: "30vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url('${AD_SRC}')`,
          }}
          alt={AD_TITLE}
          className="bg-cover bg-no-repeat m-auto rounded-b-lg"
        />
      </a>
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

import { PostStatuses, Prisma } from "@prisma/client"
import { Suspense } from "react"
import { gSSP } from "src/blitz-server"
import Spinner from "src/core/components/spinner/Spinner"
import Layout from "src/core/layouts/Layout"
import CategoryCell from "src/posts/components/CategoryCell"
import PostCell from "src/posts/components/PostCell/PostCell"
import getCategories from "src/posts/queries/getCategories"
import getPosts from "src/posts/queries/getPosts"

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx } = args
  const categories = await getCategories({}, ctx)
  const cArgs = {
    take: 24,
    skip: 0,
    where: {
      status: { not: PostStatuses.EXPIRED },
    },
    orderBy: { updatedAt: "desc" } as Prisma.PostOrderByWithRelationInput,
    distinct: [Prisma.PostScalarFieldEnum.userId],
  }
  const latestPosts = await getPosts(cArgs, ctx)
  console.log(`🚀 ~ getServerSideProps ~ latestPosts:`, latestPosts)
  return { props: { categories, latestPosts } }
})

/* function AboutPage() {
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
} */
const AD_SRC =
  "https://www.e-suceava.ro/wp-content/uploads/2024/01/Tavidor-firma-recomandata-in-Tamplarie-PVC-si-Aluminiu-de-calitatea-superioara.jpg"
const AD_HREF = "https://www.tavidor.ro/tamplarie-pvc/"
const AD_TITLE = "Tavidor, firmă recomandată în Tâmplărie PVC de calitate superioară"

const Home = ({ categories, latestPosts }) => {
  return (
    <>
      <a
        title={AD_TITLE}
        href={AD_HREF}
        className="block m-auto text-center text-accent  bg-neutral-700 rounded-md p-4 mb-6"
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
          className="bg-cover bg-no-repeat m-auto rounded-lg"
        />
      </a>
      <div>
        <Suspense fallback={<Spinner />}>
          <div className="prose mb-3">
            <h1 className="text-2xl text-base-content">Anunţuri recente</h1>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
            {latestPosts.posts.map((post) => (
              <PostCell key={post.id} post={post} />
            ))}
          </div>
          <div className="prose mb-3 mt-8">
            <h2 className="text-2xl text-base-content">Categorii</h2>
          </div>
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

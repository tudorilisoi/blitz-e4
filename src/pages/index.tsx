import { PostStatuses, Prisma } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/router"
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
    orderBy: { createdAt: "desc" } as Prisma.PostOrderByWithRelationInput,
    // NOTE prevent user from hijacking the recents page
    // distinct: [Prisma.PostScalarFieldEnum.userId],
  }
  const latestPosts = await getPosts(cArgs, ctx)
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

const FrontPageSearch = () => {
  const nextRouter = useRouter()
  // const url = "/cautare"
  const url = "/cautare?Post%5Brange%5D%5BupdatedTimestamp%5D=1667272648%3A"
  return (
    <>
      <div className="flex flex-column flex-wrap place-items-center w-full pb-4">
        <div className="flex">
          <h2 className="not-prose font-extrabold text-2xl text-base-content">
            <Link className="link link-hover text-accent " href={url}>
              <span className="">{`Căutare`}</span>
            </Link>{" "}
          </h2>
        </div>
      </div>
      <div>
        <form>
          <input
            onFocus={() => {
              nextRouter.push(url, url, { scroll: false }).catch(console.error)
            }}
            placeholder="scrie ce vrei să cauți"
            className="w-full p-4 mb-4"
            type="text"
          />
        </form>
      </div>
    </>
  )
}

const Home = ({ categories, latestPosts }) => {
  return (
    <>
      <div>
        <Suspense fallback={<Spinner />}>
          <FrontPageSearch />
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
        <a
          title={AD_TITLE}
          href={AD_HREF}
          className="block m-auto text-center text-accent  bg-neutral-700 rounded-md p-4 mt-6"
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
      </div>
    </>
  )
}
Home.getLayout = (page) => <Layout>{page}</Layout>
export default Home

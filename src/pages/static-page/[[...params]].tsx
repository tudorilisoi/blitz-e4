import Head from "next/head"
import { gSSP } from "src/blitz-server"
import Layout from "src/core/layouts/Layout"
import { getMarkDownAsHTML } from "src/staticPage"

// export const makePostsNavUrl = (categorySlug: string, page: number = 1) => {
//   return `/anunturi/${categorySlug}${page === 1 ? "" : "/pagina-" + page}`
// }

export const getServerSideProps = gSSP(async (args) => {
  const { query, ctx, res } = args
  res.setHeader("Cache-Control", `public, max-age=${3600 * 24 * 31}, stale-while-revalidate=59`)
  const params = query.params as string[]
  const fileName = params[0]
  const { rawHtml, firstHeadingText } = await getMarkDownAsHTML(fileName)
  return { props: { rawHtml, firstHeadingText } }
})

export default function MarkdownPage({ rawHtml, firstHeadingText }) {
  const head = (
    <Head>
      <title>{`${firstHeadingText}  | eRădăuţi`}</title>
    </Head>
  )

  return (
    <>
      {head}
      <div className="prose" dangerouslySetInnerHTML={{ __html: rawHtml }}></div>
    </>
  )
}
MarkdownPage.getLayout = (page) => <Layout>{page}</Layout>

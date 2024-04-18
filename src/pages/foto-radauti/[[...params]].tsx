import db from "db"
import { gSSP } from "src/blitz-server"
import { getImageUrl } from "src/core/components/image/helpers"

export const getServerSideProps = gSSP(async (args) => {
  // URL is /size-id-slug
  const { query, ctx, res } = args
  res.setHeader("Cache-Control", `public, max-age=${3600 * 24 * 31}, stale-while-revalidate=59`)
  const params = query.params as string[]
  const parts = params[0]?.split("-") || ""
  const size = parts[0] || "responsive"
  const imageId = Number(parts[1] || 0)
  if (!imageId) {
    return {
      notFound: true,
    }
  }
  const image = await db.image.findFirst({ where: { id: imageId } })
  if (!image) {
    return {
      notFound: true,
    }
  }

  return {
    redirect: {
      destination: getImageUrl(image, size !== "large"),
      permanent: true,
    },
  }
})

const FromRazzleRedirect = ({ status }) => {
  return null
}
export default FromRazzleRedirect

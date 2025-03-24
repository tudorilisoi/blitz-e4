import { Image } from "@prisma/client"
import { getImageUrl } from "./helpers"
import { canonical } from "src/helpers"

export const OGImage = (image: Image | null) => {
  let url, w, h
  if (image) {
    url = getImageUrl(image, true)
    w = image.width
    h = image.height
  } else {
    url = canonical("/logo.webp")
    w = 200
    h = 200
  }
  return (
    <>
      <meta key="og:image" property="og:image" content={url} />
      <meta key="og:image:width" property="og:image:width" content={w} />
      <meta key="og:image:height" property="og:image:height" content={h} />
    </>
  )
}

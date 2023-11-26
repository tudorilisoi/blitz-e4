import { Image } from "@prisma/client"
import { getImageUrl } from "./helpers"
import { canonical } from "src/helpers"

export const OGImage = (image: Image | null) => {
  let url, w, h
  if (image) {
    url = canonical(getImageUrl(image, true))
    w = image.width
    h = image.height
  } else {
    url = canonical("/logo.png")
    w = 200
    h = 200
  }
  return (
    <>
      <meta property="og:image" content={url} />
      <meta property="og:image:width" content={w} />
      <meta property="og:image:height" content={h} />
    </>
  )
}

import Gallery from "react-photo-gallery"
import { getImageUrl } from "./helpers"
const ImageGallery = ({ images }) => {
  const photos = images.map((i) => ({
    src: getImageUrl(i, false),
    width: i.width,
    height: i.height,
  }))
  return <Gallery photos={photos} />
}

export default ImageGallery

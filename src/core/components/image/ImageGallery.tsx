import Gallery from "react-photo-gallery"
import { getImageUrl } from "./helpers"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import { useCallback, useState } from "react"
const ImageGallery = ({ images }) => {
  const photos = images.map((i) => ({
    src: getImageUrl(i, false),
    width: i.width,
    height: i.height,
  }))
  // return <Gallery photos={photos} />

  const [index, setIndex] = useState(-1)
  const openLightbox = useCallback((event, { photo, index }) => {
    setIndex(index)
  }, [])
  const closeLightbox = useCallback(() => {
    setIndex(-1)
  }, [])

  const slides = photos.map((p) => ({
    src: p.src,
    height: p.height * 3,
    width: p.width * 3,
  }))

  return (
    <>
      {/* <button type="button" onClick={() => setIndex(3)}>
        Open Lightbox
      </button> */}

      <Gallery photos={photos} onClick={openLightbox} />

      <Lightbox
        plugins={[Zoom]}
        open={index > -1}
        index={index}
        close={closeLightbox}
        slides={slides}
        zoom={{
          maxZoomPixelRatio: 3,
        }}
      />
    </>
  )
}

export default ImageGallery

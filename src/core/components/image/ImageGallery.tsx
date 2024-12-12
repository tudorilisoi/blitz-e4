import Gallery from "react-photo-gallery"
import { getImageUrl } from "./helpers"
import Lightbox, { ControllerRef } from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Counter from "yet-another-react-lightbox/plugins/counter"
import "yet-another-react-lightbox/styles.css"
import { useCallback, useEffect, useRef, useState } from "react"
const ImageGallery = ({ images }) => {
  const photos = images.map((i) => ({
    src: getImageUrl(i, true),
    width: i.width,
    height: i.height,
  }))
  // return <Gallery photos={photos} />

  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef<ControllerRef>(null)
  const openLightbox = useCallback((event, { photo, index }) => {
    window.location.hash = `slideshow`
    setIndex(index)
    setOpen(true)
  }, [])
  const closeLightbox = useCallback(() => {
    setOpen(false)
    // window.location.hash = ``
    // NOTE remove hash altogether
    history.replaceState(null, document.title, location.pathname + location.search)
  }, [])

  useEffect(() => {
    const currentHash = !!window.location.hash
    console.log(`MOUNT:${currentHash}`)
    setOpen(currentHash)
  }, [])

  useEffect(() => {
    const handleHashChange = (ev) => {
      console.log(`🚀 ~ handleHashChange ~ window.location.hash:`, window.location.hash)
      if (!window.location.hash) {
        ref.current?.close()
        setOpen(false)
      } else {
        setOpen(true)
      }
    }

    // Attach the event listener when the component mounts
    window.addEventListener("hashchange", handleHashChange)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [ref, open])

  const slides = images.map((i) => ({
    src: getImageUrl(i, false),
    height: i.height * 3,
    width: i.width * 3,
  }))

  return (
    <>
      {/* <button type="button" onClick={() => setIndex(3)}>
        Open Lightbox
      </button> */}

      <Gallery photos={photos} onClick={openLightbox} />

      <Lightbox
        plugins={[Counter, Zoom]}
        open={open}
        index={index}
        close={closeLightbox}
        slides={slides}
        controller={{ ref }}
        counter={{ container: { style: { position: "absolute", top: "16px", left: "16px" } } }}
        zoom={{
          maxZoomPixelRatio: 3,
        }}
      />
    </>
  )
}

export default ImageGallery

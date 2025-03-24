import { useMutation } from "@blitzjs/rpc"
import { Camera, Trash2 as Trash } from "lucide-react"
import { Image } from "@prisma/client"
import { useEffect, useState } from "react"
import deleteImage from "src/images/mutations/deleteImage"
import { useOverlay } from "../overlay/OverlayProvider"
import ImageUpload, { ImageThumb } from "./ImageUpload"
import { getImageUrl } from "src/core/components/image/helpers"

export type Upload = {
  file: File
  blob: string
}

export type BlobsState = {
  [key: string]: Upload
}

export const getFileID = (f: File) => {
  return `${f.lastModified}-${f.size}-${f.name}`
}

export type BlobsChangeCallback = (blobs: BlobsState) => void

export default function UploadGrid({
  images,
  onChange,
}: {
  images: Image[]
  onChange?: BlobsChangeCallback
}) {
  const MAX_PHOTOS = parseInt(process.env.NEXT_PUBLIC_MAX_PHOTOS || "20", 10)
  const { toggle, reset } = useOverlay()
  const [deleteImageMutation] = useMutation(deleteImage)
  const [blobs, setBlobs] = useState({} as BlobsState)
  // const { blobs, setBlobs } = useBlobs()
  const [_images, setImages] = useState(images)

  useEffect(() => {
    console.log("BLOBS:", blobs)
    onChange && onChange(blobs)
  }, [blobs])

  useEffect(() => {
    setImages(images)
  }, [images])

  const blobKeys = Object.keys(blobs)

  const onDeleteImage = async (id): Promise<void> => {
    if (window.confirm("Ştergeţi definitiv această imagine?")) {
      try {
        toggle(true, { ...reset, delay: 500 })
        await deleteImageMutation({ id })
        const idx = _images.findIndex((i) => i.id === id)
        _images.splice(idx, 1)
        setImages([..._images])
      } catch (error) {
        // TODO toast
      } finally {
        toggle(false)
      }
    }
  }

  const onDeleteBlob = (id) => {
    const newBlobs = { ...blobs }
    delete newBlobs[id]
    setBlobs(newBlobs)
  }

  const onAddBlobs = (ev) => {
    ev.persist()
    let newFiles = Array.from(ev.target.files ?? []) as File[]

    //slice to MAX_PHOTOS
    newFiles = newFiles.slice(0, MAX_PHOTOS - _images.length)
    const newBlobs = { ...blobs }
    newFiles.forEach((f) => {
      const key = getFileID(f)
      if (!newBlobs[key]) {
        newBlobs[key] = {
          file: f,
          blob: "",
        }
      }
    })
    setBlobs(newBlobs)
    ev.target.value = ""
  }

  const numPhotos = _images.length + blobKeys.length
  const maxPhotosReached = numPhotos >= MAX_PHOTOS

  return (
    <>
      <label className={`btn ${maxPhotosReached ? "btn-warning" : "btn-primary"}`}>
        <Camera className="h-8 w-8 inline-block mr-1 " />
        {maxPhotosReached
          ? `Aţi atins limita de ${MAX_PHOTOS} fotografii `
          : `Adaugă fotografii (${numPhotos}/${MAX_PHOTOS})`}
        <input
          className="hidden"
          disabled={maxPhotosReached}
          multiple
          onChange={onAddBlobs}
          accept="image/*"
          id="icon-button-file"
          type="file"
        />
      </label>
      <div className={"grid grid-rows-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-34 gap-3 mt-6"}>
        {Object.entries(blobs).map(([id, blob]) => (
          <div
            key={id}
            className="relative rounded-lg shadow-lg border-gray-300 border-2 p-1 flex flex-col justify-center"
          >
            <ImageUpload
              onThumbReady={(b64) => {
                const id = getFileID(blob.file)
                blob.blob = b64
                const newBlobs = { ...blobs }
                setBlobs(newBlobs)
              }}
              file={blob.file}
            />
            <button
              onClick={async (ev) => {
                ev.preventDefault()
                await onDeleteBlob(id)
              }}
              className="absolute shadow-md shadow-black right-2 top-2 h-10 w-10 inline-block text-center  bg-red-600 p-1 rounded-full text-white hover:bg-red-800"
            >
              <Trash className="h-7 w-7 inline-block" />
            </button>
          </div>
        ))}
        {_images.map((image) => (
          <div
            key={image.id}
            className="relative rounded-lg shadow-lg border-gray-300 border-2 p-1 flex flex-col justify-center items-center"
          >
            <ImageThumb url={getImageUrl(image, true)} />

            <button
              onClick={async (ev) => {
                ev.preventDefault()
                await onDeleteImage(image.id)
              }}
              className="absolute shadow-md shadow-black right-2 top-2 h-10 w-10 inline-block text-center  bg-red-600 p-1 rounded-full text-white hover:bg-red-800"
            >
              <Trash className="h-7 w-7 inline-block" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

import { useEffect, useState } from "react"
import ImageUpload, { ImageThumb } from "./ImageUpload"
import { PhotoIcon } from "@heroicons/react/24/outline"
import { TrashIcon } from "@heroicons/react/24/outline"
import { Image } from "@prisma/client"
import deleteImage from "src/images/mutations/deleteImage"
import { useMutation } from "@blitzjs/rpc"
import { useOverlay } from "../spinner/OverlayProvider"
import { useFormContext } from "react-hook-form"

const fileID = (f: File) => {
  return `${f.name}-${f.size}`
}

type Upload = {
  file: File
  blob: string
}

type Uploads = Record<string, Upload>

export default function UploadGrid({ images }: { images: Image[] }) {
  const {
    setValue,
    register,
    formState: { isSubmitting, errors },
  } = useFormContext()
  const { toggle } = useOverlay()
  const [deleteImageMutation] = useMutation(deleteImage)
  const [blobs, setBlobs] = useState({} as Uploads)
  const [_images, setImages] = useState(images)
  const max = 10

  useEffect(() => {
    console.log("BLOBS:", blobs)
    const blobsValue = {}
    Object.entries(blobs).forEach(([id, blob]) => {
      blobsValue[id] = blob.blob
    })
    setValue("blobs", blobsValue, { shouldTouch: true })
  }, [blobs])

  const blobKeys = Object.keys(blobs)

  const onDeleteImage = async (id) => {
    if (window.confirm("This will be deleted")) {
      try {
        toggle(true)
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

  const onAddBlobs = (ev) => {
    ev.persist()
    const newFiles = Array.from(ev.target.files ?? []) as File[]
    const newBlobs = { ...blobs }
    newFiles.forEach((f) => {
      const key = fileID(f)
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

  return (
    <>
      <input type="hidden" {...register("blobs")} />
      <label className="bg-blue-700 text-xl inline-block rounded-2xl p-1 px-4 text-white hover:bg-blue-300 ">
        <PhotoIcon className="h-10 w-10 inline-block mr-2 " />
        {"Adaugă fotografii"}
        <input
          className="hidden"
          multiple
          onChange={onAddBlobs}
          accept="image/*"
          id="icon-button-file"
          type="file"
        />
      </label>
      <div className={"grid grid-rows-1 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3"}>
        {Object.entries(blobs).map(([id, blob]) => (
          <div
            key={id}
            className="rounded-lg shadow-lg border-gray-300 border-2 p-1 flex flex-col justify-center"
          >
            <ImageUpload
              onThumbReady={(b64) => {
                const id = fileID(blob.file)
                blob.blob = b64
                const newBlobs = { ...blobs }
                setBlobs(newBlobs)
              }}
              file={blob.file}
            />
          </div>
        ))}
        {_images.map((image) => (
          <div
            key={image.id}
            className="relative rounded-lg shadow-lg border-gray-300 border-2 p-1 flex flex-col justify-center items-center"
          >
            <ImageThumb url={`/uploads/${image.fileName}`} />

            <TrashIcon
              onClick={() => onDeleteImage(image.id)}
              className="absolute right-2 top-2 h-10 w-10 inline-block bg-red-600 p-1 rounded text-white hover:bg-red-800"
            />
          </div>
        ))}
      </div>
    </>
  )
}

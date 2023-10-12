import { useEffect, useState } from "react"
import ImageUpload from "./ImageUpload"
import { PhotoIcon } from "@heroicons/react/24/outline"

const fileID = (f: File) => {
  return `${f.name}-${f.size}`
}

type Upload = {
  file: File
  blob: string
}

export default function UploadGrid() {
  const [blobs, setBlobs] = useState({} as Record<string, Upload>)
  const max = 10

  useEffect(() => {
    console.log("BLOBS:", blobs)
  }, [blobs])

  const blobKeys = Object.keys(blobs)

  return (
    <>
      <label className="bg-blue-700 text-xl inline-block rounded-2xl p-1 px-4 text-white hover:bg-blue-300 ">
        <PhotoIcon className="h-10 w-10 inline-block mr-2 " />
        {"Adaugă fotografii"}
        <input
          className="hidden"
          multiple
          onChange={(ev) => {
            ev.persist()
            const newFiles = Array.from(ev.target.files ?? [])
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
          }}
          accept="image/*"
          id="icon-button-file"
          type="file"
        />
      </label>
      <div className={"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3"}>
        {Object.entries(blobs).map(([id, blob]) => (
          <ImageUpload
            onThumbReady={(b64) => {
              const id = fileID(blob.file)
              blob.blob = b64
              const newBlobs = { ...blobs }
              setBlobs(newBlobs)
            }}
            key={id}
            file={blob.file}
          />
        ))}
      </div>
    </>
  )
}

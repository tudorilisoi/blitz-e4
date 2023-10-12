import { useState } from "react"
import ImageUpload from "./ImageUpload"
import { PhotoIcon } from "@heroicons/react/24/outline"

export default function UploadGrid() {
  const [files, setFiles] = useState([] as File[])
  const totalCount = files.length
  const max = 10

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
            let _files: File[] = []
            if (ev.target.files) {
              _files = Array.from(ev.target.files)
            }
            _files = _files.slice(0, +max - totalCount)
            setFiles([...files, ..._files])
            ev.target.value = ""
          }}
          accept="image/*"
          id="icon-button-file"
          type="file"
        />
      </label>
      <div className={"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3"}>
        {files.map((file, idx) => (
          <ImageUpload key={idx} file={file} />
        ))}
      </div>
    </>
  )
}

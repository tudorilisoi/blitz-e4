import { useState } from "react"
import ImageUpload from "./ImageUpload"

export default function UploadGrid() {
  const [files, setFiles] = useState([] as File[])
  const totalCount = files.length
  const max = 10

  return (
    <>
      <label className="btn btn-primary">
        <i className="fa fa-image">[Icon]</i> {"Adaugă fotografii"}
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

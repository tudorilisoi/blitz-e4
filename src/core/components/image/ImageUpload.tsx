import Pica from "pica"
import { useCallback, useEffect, useState } from "react"
import { getFileID } from "./UploadGrid"

const styles = {
  wrapper: {
    display: "flex",
    width: "100%",
    // minHeight: "400px",
    // flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  thumb: {
    minHeight: "100px",
    maxWidth: "100%",
    display: "block",
  },
}

/* performance.now polyfill
const polyFill = function () {
  if (window.performance && window.performance.now) return
  if (!window.performance) window.performance = {}
  var methods = ["webkitNow", "msNow", "mozNow"]
  for (var i = 0; i < methods.length; i++) {
    if (window.performance[methods[i]]) {
      window.performance.now = window.performance[methods[i]]
      return
    }
  }
  if (Date.now) {
    window.performance.now = function () {
      return Date.now()
    }
    return
  }
  window.performance.now = function () {
    return +new Date()
  }
} */

async function resize({ file, fileID, thumbID, onError, onSuccess }) {
  const getThumb = () => document.getElementById(thumbID) as HTMLCanvasElement

  //offscreen canvases
  const tempCanvas: HTMLCanvasElement = document.createElement("canvas")
  const origCanvas: HTMLCanvasElement = document.createElement("canvas")

  let error
  const image = new Image()
  image.onerror = onError

  image.onload = async () => {
    try {
      console.log(`${fileID} Image loaded`)
      let start = performance.now()
      const o = origCanvas
      const { width: w, height: h } = image
      o.width = w
      o.height = h
      console.log(`src: w: ${w}, h: ${h}`)
      const ctx = o.getContext("2d")
      ctx?.drawImage(image, 0, 0)

      const targetMax = 1280

      const imgMax = Math.max(w, h)
      const ratio = targetMax / imgMax

      const tw = Math.floor(w * ratio)
      const th = Math.floor(h * ratio)
      console.log(`rsz to: w: ${tw}, h: ${th}, ratio: ${ratio}`)

      const d = getThumb()
      if (ratio >= 1) {
        //just copy original
        console.log(`skip resize, ratio is overunity`)

        d.width = w
        d.height = h
        d.getContext("2d", { alpha: false })?.drawImage(o, 0, 0)
        // let time = (performance.now() - start).toFixed(2);
        // console.log(`ops took: ${time}ms`)
        // return;
      } else {
        const t = tempCanvas
        t.width = tw
        t.height = th
        const pica = Pica()
        await pica.resize(o, t, {
          transferable: true,
        })
        //visible thumb
        const d = getThumb()
        d.width = tw
        d.height = th
        d.getContext("2d", { alpha: false })?.drawImage(t, 0, 0)
      }

      const b64Thumb = d.toDataURL("image/jpeg")

      let time = (performance.now() - start).toFixed(2)
      console.log(`${fileID} rsz took: ${time}ms`)
      onSuccess(b64Thumb)
    } catch (err) {
      console.error(err)
      error = `Eroare, reîncercaţi`
    } finally {
      if (error) {
        onError(error)
      }
    }
  }
  image.src = window.URL.createObjectURL(file)
}

const ImageUpload = ({ file, onThumbReady, onError }) => {
  // const ImageUpload = ({ file, onThumbReady, onError }) => {
  // useMemo(() => {
  //   polyFill()
  // }, [])

  // console.log(`*** RENDER FILE `, file)
  // if (!(file instanceof File)) {
  //   return (
  //     <div style={styles.wrapper}>
  //       <img src={file.url} style={styles.thumb} id={file.id} className="img-responsive" />
  //       {/* <input type="file" onChange={onFileSelect} /> */}
  //     </div>
  //   )
  // }

  const fileID = getFileID(file)
  const thumbID = `thumb-${fileID}`

  const [state, setState] = useState({
    file: null,
    b64Thumb: null,
    error: null,
    loading: false,
  })

  const _onError = useCallback((error) => {
    setState((state) => ({ ...state, error }))
    onError(error)
  }, [])

  const _onSuccess = useCallback((b64Thumb) => {
    setState((state) => ({ ...state, b64Thumb }))
    onThumbReady(b64Thumb)
  }, [])

  // console.log(`*** COMPONENT INIT ${fileID} ${state.b64Thumb ? 'DONE' : '??'}  `)

  useEffect(() => {
    console.log(`*** RESIZE ${fileID}`)
    setState((state) => ({ ...state, loading: true }))
    resize({
      file,
      fileID,
      thumbID,
      onError: _onError,
      onSuccess: _onSuccess,
    }).catch(_onError)
  }, [file, fileID, thumbID, _onError, _onSuccess])

  let message: any = null
  let showThumb = false
  if (state.loading) {
    message = "LOADING"
  }
  if (state.error) {
    message = "ERROR"
  }
  if (state.b64Thumb) {
    message = null
    showThumb = true
  }

  return (
    <div style={styles.wrapper}>
      {!message ? null : <div style={styles.thumb}>{message}</div>}
      <canvas
        style={{ ...styles.thumb, display: showThumb ? "block" : "none" }}
        id={thumbID}
        className="p-1"
      />
      {/* <input type="file" onChange={onFileSelect} /> */}
    </div>
  )
}
const noop = () => {}
ImageUpload.defaultProps = {
  onError: noop,
  onThumbReady: noop,
}
export default ImageUpload

export const ImageThumb = ({ url }) => {
  return (
    <div style={styles.wrapper}>
      <img
        src={url}
        alt="Uploaded image"
        style={{ ...styles.thumb, display: "block" }}
        key={url}
        className="p-1"
      />
      {/* <input type="file" onChange={onFileSelect} /> */}
    </div>
  )
}

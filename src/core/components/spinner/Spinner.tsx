import { useEffect, useState } from "react"
import { Watch } from "react-loader-spinner"
import { OVERLAY_TRANSITION_DURATION } from "./OverlayProvider"

const Overlay = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, OVERLAY_TRANSITION_DURATION + 100)
    return () => clearTimeout(timer)
  }, [])
  if (!visible) {
    return null
  }
  return (
    <div
      style={{
        zIndex: "100",
        display: "flex",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
      className="justify-center flex-col align-middle text-center "
    >
      <Watch
        height="80"
        width="80"
        radius="48"
        color="#000"
        ariaLabel="watch-loading"
        wrapperStyle={{ textAlign: "center", justifyContent: "center" }}
        visible={true}
      />
      <div className="mt-4 text-6xl">{"Un moment..."}</div>
    </div>
  )
}

export default Overlay

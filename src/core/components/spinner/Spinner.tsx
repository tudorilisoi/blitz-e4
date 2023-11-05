import { useEffect, useState } from "react"
import { Watch } from "react-loader-spinner"
import {
  OVERLAY_TRANSITION_DURATION,
  messageClassName,
  messageWrapperClassName,
} from "../overlay/OverlayProvider"

import ViewportCentered from "./ViewPortCentered"

const Spinner = (props?) => {
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
    <ViewportCentered>
      <div className={messageWrapperClassName}>
        <Watch
          height="80"
          width="80"
          radius="48"
          color="#eee"
          ariaLabel="watch-loading"
          wrapperStyle={{ textAlign: "center", justifyContent: "center" }}
          visible={true}
        />
        <div className={messageClassName}>{props?.children || "Un moment..."}</div>
      </div>
    </ViewportCentered>
  )
}

export default Spinner

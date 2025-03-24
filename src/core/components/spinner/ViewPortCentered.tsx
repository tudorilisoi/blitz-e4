import React from "react"
const ViewportCentered = ({ children }): JSX.Element => {
  return (
    <div className="z-[100]  pointer-events-none top-0 left-0 right-0 bottom-0 fixed flex justify-center flex-col align-middle text-center ">
      <div className="pointer-events-auto">{children}</div>
    </div>
  )
}

export default ViewportCentered

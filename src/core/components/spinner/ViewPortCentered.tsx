const ViewportCentered = ({ children }) => {
  return (
    <div
      style={{
        zIndex: "100",
        // display: "flex",
        // relative to the viewport
        // position: "fixed",
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0,
      }}
      className="top-0 left-0 right-0 bottom-0 fixed flex justify-center flex-col align-middle text-center "
    >
      {children}
    </div>
  )
}

export default ViewportCentered

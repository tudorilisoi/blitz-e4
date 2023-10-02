import { Watch } from "react-loader-spinner"

const Spinner = () => {
  return (
    <div
      style={{ display: "flex", position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
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

export default Spinner

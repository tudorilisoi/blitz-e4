import { FaceFrownIcon } from "@heroicons/react/24/outline"
import ViewportCentered from "./spinner/ViewPortCentered"
import { messageClassName } from "./spinner/Spinner"
import { useOverlay } from "./overlay/OverlayProvider"

export const ErrorIcon = () => (
  <FaceFrownIcon className="h-[104px] w-[104px] inline-block text-error" />
)

export const ErrorNotification = ({ error, ...props }: { error: any }) => {
  const { toggle } = useOverlay()

  return (
    <ViewportCentered>
      <div className="flex flex-col place-content-center mx-auto rounded-2xl min-h-[40vh] w-[50vw] bg-black bg-opacity-80 text-center">
        <div className="text-center">
          <ErrorIcon />
        </div>
        <h2 className={`${messageClassName} text-error`}>{`Eroare: ${error.message}`}</h2>
        <div className="flex flex-wrap mt-4 px-6 gap-6 place-items-center">
          <button
            onClick={() => toggle(false)}
            className="btn btn-error w-full border-neutral-600 border-2"
          >
            OK, asta-i viaţa!
          </button>
        </div>
      </div>
    </ViewportCentered>
  )
}

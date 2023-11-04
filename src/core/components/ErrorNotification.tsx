import { FaceFrownIcon } from "@heroicons/react/24/outline"
import ViewportCentered from "./spinner/ViewPortCentered"
import { messageClassName } from "./spinner/Spinner"
import { useOverlay } from "./overlay/OverlayProvider"

export const ErrorNotification = ({ error, ...props }: { error: any }) => {
  const { toggle } = useOverlay()

  return (
    <ViewportCentered>
      <div className="min-w-fit max-w-3xl mx-auto">
        <div className="text-center">
          <FaceFrownIcon className="h-[104px] w-[104px] inline-block text-error" />
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

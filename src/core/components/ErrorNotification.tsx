import { ErrorIcon } from "./notifications"
import { messageClassName, messageWrapperClassName, useOverlay } from "./overlay/OverlayProvider"
import ViewportCentered from "./spinner/ViewPortCentered"

export const ErrorNotification = ({ error, ...props }: { error: any }) => {
  const { toggle } = useOverlay()

  return (
    <ViewportCentered>
      <div className={messageWrapperClassName}>
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

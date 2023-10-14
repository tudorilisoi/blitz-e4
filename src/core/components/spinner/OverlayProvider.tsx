import { createContext, useContext, useMemo, useState } from "react"
import Spinner from "./Spinner"
import ViewportCentered from "./ViewPortCentered"

export const OVERLAY_TRANSITION_DURATION = 200

interface ToggleFunction {
  (newValue: any, component?: JSX.Element): void
}
interface ContextType {
  toggle: ToggleFunction
  isOverlayDisplayed: boolean
  spinner: JSX.Element
}
const ctx: ContextType = {
  toggle: () => {},
  isOverlayDisplayed: true,
  spinner: <></>,
}
const OverlayContext = createContext(ctx)

const OverlayProvider = ({ children }) => {
  const [isOverlayDisplayed, setIsOverlayDisplayed] = useState(false)
  const spinner = useMemo(() => <Spinner />, [])
  const [component, setComponent] = useState(spinner)

  const toggle = (newValue: any, component?: JSX.Element) => {
    const nextValue = newValue !== undefined ? newValue : !isOverlayDisplayed
    setIsOverlayDisplayed(nextValue)
    if (component) {
      setComponent(component)
    }
  }

  return (
    <OverlayContext.Provider value={{ isOverlayDisplayed, toggle, spinner }}>
      <>
        <style jsx>{`
          .blur-container {
            position: relative;
            transition: filter ${OVERLAY_TRANSITION_DURATION / 1000}s ease-in-out; /* Apply transition to the filter property */
          }
          .blur-active {
            filter: blur(5px);
          }

          /* Apply an alpha fade effect */
          .blur-active::after {
            content: "";
            background: rgba(255, 255, 255, 0.5);
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 80;
          }
        `}</style>
        <div
          key={"spinner_provider_children_wrapper"}
          className={isOverlayDisplayed ? "blur-container blur-active" : "blur-container"}
        >
          {children}
        </div>
        {isOverlayDisplayed ? <ViewportCentered>{component}</ViewportCentered> : null}
      </>
    </OverlayContext.Provider>
  )
}

// Custom hook to use the context
const useOverlay = () => {
  const context = useContext(OverlayContext)
  if (!context) {
    throw new Error("useOverlay must be used within a OverlayProvider")
  }
  return context
}

export { OverlayProvider, useOverlay }

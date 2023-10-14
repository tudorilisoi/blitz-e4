import { createContext, useContext, useMemo, useState } from "react"
import { useStore } from "../useStore"
import Spinner from "./Spinner"
import ViewportCentered from "./ViewPortCentered"

export const OVERLAY_TRANSITION_DURATION = 200

interface ToggleOptions {
  delay?: number
  component?: JSX.Element
}
interface ToggleFunction {
  (newValue: any, options?: ToggleOptions): void
}

interface ContextType {
  toggle: ToggleFunction
  isOverlayDisplayed: boolean
  spinner: JSX.Element
  reset: ToggleOptions
}
const ctx: ContextType = {
  toggle: () => {},
  isOverlayDisplayed: true,
  spinner: <></>,
  reset: {},
}

const OverlayContext = createContext(ctx)

const useTimer = (id) => {}

const OverlayProvider = ({ children }) => {
  const [isOverlayDisplayed, setIsOverlayDisplayed] = useState(false)
  const spinner = useMemo(() => <Spinner />, [])
  const [component, setComponent] = useState(spinner)
  const { getStore, setStore } = useStore("timer")

  const toggle = (newValue: any, options: ToggleOptions = {}) => {
    const { delay, component } = options
    const nextValue = newValue !== undefined ? newValue : !isOverlayDisplayed
    if (component) {
      setComponent(component)
    }
    if (!delay) {
      setIsOverlayDisplayed(nextValue)
      return
    }
    let timer = getStore()
    if (timer) {
      console.log("Cancel timer toggle", timer)
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      console.log("Trigger timer (curr, captured)", getStore(), timer)
      setIsOverlayDisplayed(nextValue)
    }, delay)
    console.log("Set timer", timer)
    setStore(timer)
  }

  return (
    <OverlayContext.Provider
      value={{ isOverlayDisplayed, toggle, spinner, reset: { component: spinner } }}
    >
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

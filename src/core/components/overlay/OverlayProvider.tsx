import { createContext, useContext, useMemo, useState } from "react"
import { useStore } from "../useStore"
import Spinner from "../spinner/Spinner"
import ViewportCentered from "../spinner/ViewPortCentered"
import styles from "./Overlay.module.css"

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

const OverlayProvider = ({ children, ...rest }) => {
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
      <div {...rest}>
        <div
          key={"spinner_provider_children_wrapper"}
          className={
            isOverlayDisplayed
              ? `${styles.blurContainer} ${styles.blurActive}`
              : styles.blurContainer
          }
        >
          {children}
        </div>
        {isOverlayDisplayed ? <ViewportCentered>{component}</ViewportCentered> : null}
      </div>
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

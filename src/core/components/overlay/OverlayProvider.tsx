import { createContext, useContext, useMemo, useState } from "react"
import { useStore } from "../useStore"
import Spinner from "../spinner/Spinner"
import ViewportCentered from "../spinner/ViewPortCentered"
import styles from "./Overlay.module.css"

export const overlayStyles = styles

export const OVERLAY_TRANSITION_DURATION = 200
export const messageClassName = "mt-4 text-3xl sm:text-5xl text-neutral-content"
export const messageWrapperClassName =
  "flex flex-col place-content-center mx-auto rounded-2xl min-h-[40vh] w-fit min-w-[80vw] md:min-w-[40vw]  max-w-[70vw] p-6 bg-black bg-opacity-80 text-center"

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
    let timer = getStore()
    if (component) {
      setComponent(component)
    }
    if (!delay) {
      clearTimeout(timer)
      setIsOverlayDisplayed(nextValue)
      return
    }
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
      {children}
      {isOverlayDisplayed ? <ViewportCentered>{component}</ViewportCentered> : null}
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

const useOverlayClassNames = (forceOn = false) => {
  const { isOverlayDisplayed } = useOverlay()
  let cn = overlayStyles.blurContainer
  if (forceOn || isOverlayDisplayed) {
    cn = `${cn} ${overlayStyles.blurActive}`
  }
  return cn
}

export { OverlayProvider, useOverlay, useOverlayClassNames }

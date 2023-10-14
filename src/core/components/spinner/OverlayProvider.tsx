import { createContext, useContext, useEffect, useRef, useState } from "react"
import Spinner from "./Spinner"

export const OVERLAY_TRANSITION_DURATION = 200

const OverlayContext = createContext({ toggle: (newValue) => {}, isOverlayDisplayed: true })

const getHTML = () => document.querySelector("html")
const getMaxScrollTop = () => {
  return window.document.documentElement.scrollHeight - window.document.documentElement.clientHeight
}

const OverlayProvider = ({ children }) => {
  const [isOverlayDisplayed, setIsOverlayDisplayed] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const [scrollValue, setScrollValue] = useState(0)

  useEffect(() => {
    const onScroll = (e) => {
      if (!isOverlayDisplayed) {
        //NOTE save html element scrollTop
        setScrollValue(e.target.documentElement.scrollTop)
      }
    }
    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [isOverlayDisplayed])

  useEffect(() => {
    let timer
    // @see https://gist.github.com/jeffijoe/510f6823ef809e3711ed307823b48c0a
    const restoreScroll = (scrollValue) => {
      const currentValue = document.documentElement.scrollTop
      const newValue = Math.min(getMaxScrollTop(), scrollValue)
      if (currentValue === 0 && currentValue !== newValue) {
        console.log("RESTORE OVL SCROLL", newValue, currentValue)
        document.documentElement.scrollTop = newValue
      }
    }
    if (ref && ref.current) {
      if (isOverlayDisplayed) {
        // NOTE set overlay scroll top since this is now overflow:hidden beause it has .blur-active
        ref.current.scrollTop = scrollValue
      } else {
        // window.requestIdleCallback(restoreScroll)
        timer = window.setInterval(() => restoreScroll(scrollValue), 16)
      }
    }
    return () => clearInterval(timer)
  }, [isOverlayDisplayed, scrollValue])

  useEffect(() => {
    console.log("MOUNT")
  }, [])

  const toggle = (newValue: any) => {
    const nextValue = newValue !== undefined ? newValue : !isOverlayDisplayed
    setIsOverlayDisplayed(nextValue)
  }

  return (
    <OverlayContext.Provider value={{ isOverlayDisplayed, toggle }}>
      <>
        <style jsx>{`
          .blur-outer {
            position: relative;
            transition: filter ${OVERLAY_TRANSITION_DURATION / 1000}s ease-in-out; /* Apply transition to the filter property */
          }
          .blur-active {
            overflow: hidden;
            max-height: 75vh;
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
          ref={ref}
          className={isOverlayDisplayed ? "blur-outer blur-active" : "blur-outer"}
        >
          {children}
        </div>
        {isOverlayDisplayed ? <Spinner /> : null}
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

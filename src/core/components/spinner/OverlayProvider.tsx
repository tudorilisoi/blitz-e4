import React, { createContext, useContext, useMemo, useState } from "react"
import Spinner from "./Spinner"

export const OVERLAY_TRANSITION_DURATION = 200

// Step 1: Create a new context
const OverlayContext = createContext({ toggle: (newValue) => {}, isOverlayDisplayed: true })

// Step 2 and 3: Create the provider component with toggle functionality
const OverlayProvider = ({ children }) => {
  const [isOverlayDisplayed, setIsOverlayDisplayed] = useState(false)

  // Define the toggle function
  const toggle = (newValue: any) => {
    if (newValue !== undefined) {
      return setIsOverlayDisplayed(newValue)
    }
    setIsOverlayDisplayed((prevState) => !prevState)
  }
  const style = useMemo(() => (isOverlayDisplayed ? { display: "none" } : {}), [isOverlayDisplayed])

  return (
    // Step 4: Provide state and toggle function through the context's Provider
    <OverlayContext.Provider value={{ isOverlayDisplayed, toggle }}>
      <>
        <style jsx>{`
          .blur-div {
            position: relative;
            transition: filter ${OVERLAY_TRANSITION_DURATION / 1000}s ease-in-out; /* Apply transition to the filter property */
          }
          .blur-fade-div {
            overflow: hidden;
            max-height: 80vh;
            filter: blur(5px);
          }

          /* Apply an alpha fade effect */
          .blur-fade-div::after {
            /* Adjust the blur amount as needed */
            content: "";
            background: rgba(255, 255, 255, 0.2);
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none; /* Allows interaction with content behind */
            z-index: 80; /* Place it below the content */
          }
        `}</style>
        {isOverlayDisplayed ? <Spinner /> : null}
        <div
          key={"spinner_provider_children_wrapper"}
          className={isOverlayDisplayed ? "blur-div blur-fade-div" : "blur-div"}
        >
          {children}
        </div>
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
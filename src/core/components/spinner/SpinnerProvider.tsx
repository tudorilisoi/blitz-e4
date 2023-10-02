import React, { createContext, useContext, useMemo, useState } from "react"
import Spinner from "./Spinner"

// Step 1: Create a new context
const SpinnerContext = createContext({})

// Step 2 and 3: Create the provider component with toggle functionality
const SpinnerProvider = ({ children }) => {
  const [isSpinnerDisplayed, setIsSpinnerDisplayed] = useState(false)

  // Define the toggle function
  const toggle = (newValue: any) => {
    if (newValue !== undefined) {
      return setIsSpinnerDisplayed(newValue)
    }
    setIsSpinnerDisplayed((prevState) => !prevState)
  }
  const style = useMemo(() => (isSpinnerDisplayed ? { display: "none" } : {}), [isSpinnerDisplayed])

  return (
    // Step 4: Provide state and toggle function through the context's Provider
    <SpinnerContext.Provider value={{ isSpinnerDisplayed, toggle }}>
      <>
        {isSpinnerDisplayed ? <Spinner /> : null}
        <div key={"spinner_provider_children_wrapper"} style={style}>
          {children}
        </div>
      </>
    </SpinnerContext.Provider>
  )
}

// Custom hook to use the context
const useSpinner = () => {
  const context = useContext(SpinnerContext)
  if (!context) {
    throw new Error("useSpinner must be used within a SpinnerProvider")
  }
  return context
}

export { SpinnerProvider, useSpinner }

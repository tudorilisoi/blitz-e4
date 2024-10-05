import { useEffect, useState } from "react"

const useScrollPosition = (key: string, conditionFn: () => boolean) => {
  // Save scroll position to sessionStorage when the user scrolls
  const [timer, setTimer] = useState(-1)
  useEffect(() => {
    const saveScrollPosition = () => {
      if (!conditionFn()) {
        return
      }
      timer && window.clearTimeout(timer)
      const _timer = window.setTimeout(() => {
        sessionStorage.setItem(key, window.scrollY.toString())
      }, 50)
      setTimer(_timer)
    }

    // Add event listener to capture the scroll event
    window.addEventListener("scroll", saveScrollPosition)

    // Clean up event listener when component unmounts
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("scroll", saveScrollPosition)
    }
  }, [timer, key])

  // Restore scroll position on component mount (or when the page reloads)
  return () => {
    const savedScrollPosition = sessionStorage.getItem(key)
    if (savedScrollPosition) {
      window.setTimeout(() => {
        if (!conditionFn()) {
          return
        }
        console.log("Restore scroll")
        window.scrollTo(0, parseInt(savedScrollPosition, 10))
        sessionStorage.setItem(key, "")
      }, 300)
    }
  }
}

export default useScrollPosition

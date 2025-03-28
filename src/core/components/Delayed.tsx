import React, { useState, useEffect, FC, ReactNode } from "react"

type Props = {
  children: React.ReactNode
  waitBeforeShow?: number
}

const Delayed = ({ children, waitBeforeShow = 500 }: Props): ReactNode => {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true)
    }, waitBeforeShow)
    return () => clearTimeout(timer)
  }, [waitBeforeShow])

  return isShown ? children : null
}

export default Delayed

import { useState } from "react"

export const useStore = (id) => {
  const [store, _] = useState(new Map())
  const setStore = (value) => store.set(id, value)
  const getStore = () => store.get(id)
  return {
    setStore,
    getStore,
  }
}

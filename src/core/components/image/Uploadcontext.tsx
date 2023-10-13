import React, { createContext, useContext, useState, ReactNode } from "react"

export type Upload = {
  file: File
  blob: string
}

// Define the shape of the 'blobs' object
export type BlobsState = {
  [key: string]: Upload
}

// Define the context type
type BlobsContextType = {
  blobs: BlobsState
  addBlob: (key: string, value: Upload) => void
  clearBlob: (key: string) => void
  setBlobs: (blobs: BlobsState) => void
}

const BlobsContext = createContext<BlobsContextType | undefined>(undefined)

interface BlobsProviderProps {
  children: ReactNode
}

export const BlobsProvider: React.FC<BlobsProviderProps> = ({ children }) => {
  const [blobs, setBlobs] = useState<BlobsState>({})

  const addBlob = (key: string, value: Upload) => {
    setBlobs((prevBlobs) => ({
      ...prevBlobs,
      [key]: value,
    }))
  }

  const clearBlob = (key: string) => {
    setBlobs((prevBlobs) => {
      const { [key]: _, ...rest } = prevBlobs
      return rest
    })
  }

  return (
    <BlobsContext.Provider value={{ blobs, addBlob, clearBlob, setBlobs }}>
      {children}
    </BlobsContext.Provider>
  )
}

export const useBlobs = () => {
  const context = useContext(BlobsContext)
  if (context === undefined) {
    throw new Error("useBlobs must be used within a BlobsProvider")
  }
  return context
}

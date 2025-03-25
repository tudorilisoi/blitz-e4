import { useEffect, useState } from "react"

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const ws = new WebSocket(url)
    setSocket(ws)

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data])
    }

    return () => {
      ws.close()
    }
  }, [url])

  const sendMessage = (message: string) => {
    if (socket) {
      socket.send(message)
    }
  }

  return { messages, sendMessage }
}

export default useWebSocket

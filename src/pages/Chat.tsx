import { useEffect, useState } from "react"
const isProduction = process.env.NODE_ENV === "production"

const Chat = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState<string>("")

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001")
    setSocket(ws)

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data])
    }

    return () => {
      ws.close()
    }
  }, [])

  const sendMessage = () => {
    if (socket && input.trim() !== "") {
      socket.send(JSON.stringify({ data: input }))
      setInput("")
    }
  }

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            sendMessage()
          }
        }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default Chat

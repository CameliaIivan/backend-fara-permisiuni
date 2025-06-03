"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { getConversationById, sendMessage } from "../services/socialService"
import Card from "../components/Card"
import Button from "../components/Button"
import Textarea from "../components/Textarea"
import Alert from "../components/Alert"
import { useAuth } from "../contexts/AuthContext"

function ConversationPage() {
  const { id } = useParams()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const { currentUser } = useAuth()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true)
        const data = await getConversationById(id)
        setConversation(data.conversatie)
        setMessages(data.mesaje || [])
      } catch (error) {
        console.error("Error fetching conversation:", error)
        setError("A apărut o eroare la încărcarea conversației. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }

    fetchConversation()

    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchConversation, 10000)
    return () => clearInterval(interval)
  }, [id])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      setSending(true)
      const messageData = {
        id_conversatie: Number(id),
        continut: newMessage,
      }
      const sentMessage = await sendMessage(messageData)
      setMessages((prev) => [...prev, sentMessage])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      setError("A apărut o eroare la trimiterea mesajului. Vă rugăm încercați din nou.")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Se încarcă conversația...</div>
  }

  if (error) {
    return (
      <Alert type="error" className="my-8">
        {error}
      </Alert>
    )
  }

  if (!conversation) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Conversația nu a fost găsită</h2>
        <Link to="/messages">
          <Button>Înapoi la mesaje</Button>
        </Link>
      </div>
    )
  }

  const otherUser = currentUser.id === conversation.id_utilizator_1 ? conversation.User2 : conversation.User1

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link to="/messages">
          <Button variant="outline">&larr; Înapoi la mesaje</Button>
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Header className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mr-3">
            {otherUser.nume.charAt(0)}
          </div>
          <h1 className="text-xl font-bold">{otherUser.nume}</h1>
        </Card.Header>
      </Card>

      <div className="bg-white rounded-lg shadow-md mb-4 p-4 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nu există mesaje în această conversație.</p>
            <p className="text-gray-500">Trimite primul mesaj mai jos!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.id_expeditor === currentUser.id
              return (
                <div key={message.id_mesaj} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isCurrentUser ? "bg-primary-100 text-primary-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.continut}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {new Date(message.data_trimitere).toLocaleTimeString("ro-RO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <Card>
        <Card.Body>
          <form onSubmit={handleSendMessage} className="flex items-end">
            <Textarea
              id="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Scrie un mesaj..."
              className="flex-grow mr-2"
              rows={2}
            />
            <Button type="submit" disabled={sending || !newMessage.trim()}>
              {sending ? "Se trimite..." : "Trimite"}
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ConversationPage

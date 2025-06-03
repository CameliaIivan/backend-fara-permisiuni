"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getConversations } from "../services/socialService"
import Card from "../components/Card"
import Alert from "../components/Alert"
import Input from "../components/Input"
import { useAuth } from "../contexts/AuthContext"

function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const data = await getConversations()
        setConversations(data)
      } catch (error) {
        console.error("Error fetching conversations:", error)
        setError("A apărut o eroare la încărcarea conversațiilor. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => {
    const otherUser = currentUser.id === conversation.id_utilizator_1 ? conversation.User2 : conversation.User1

    return otherUser.nume.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Sort conversations by the most recent message
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const aDate = a.mesaje && a.mesaje[0] ? new Date(a.mesaje[0].data_trimitere) : new Date(a.data_start)
    const bDate = b.mesaje && b.mesaje[0] ? new Date(b.mesaje[0].data_trimitere) : new Date(b.data_start)
    return bDate - aDate
  })

  if (loading) {
    return <div className="text-center py-8">Se încarcă conversațiile...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mesaje</h1>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-6">
        <Input
          label="Caută conversații"
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Caută după nume..."
        />
      </div>

      {sortedConversations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600 mb-4">Nu ai nicio conversație activă.</p>
          <p className="text-gray-500">Poți începe o conversație din profilul unui utilizator.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedConversations.map((conversation) => {
            const otherUser = currentUser.id === conversation.id_utilizator_1 ? conversation.User2 : conversation.User1

            const lastMessage = conversation.mesaje && conversation.mesaje[0]

            return (
              <Link key={conversation.id_conversatie} to={`/messages/${conversation.id_conversatie}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <Card.Body className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mr-4">
                      {otherUser.nume.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <h2 className="font-bold">{otherUser.nume}</h2>
                      {lastMessage ? (
                        <p className="text-sm text-gray-600 truncate">{lastMessage.continut}</p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Nicio conversație încă</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {lastMessage
                        ? new Date(lastMessage.data_trimitere).toLocaleDateString("ro-RO")
                        : new Date(conversation.data_start).toLocaleDateString("ro-RO")}
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MessagesPage

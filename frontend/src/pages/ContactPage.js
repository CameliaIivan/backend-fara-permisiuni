"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAdmins, createConversation, sendMessage } from "../services/socialService"
import Textarea from "../components/Textarea"
import Button from "../components/Button"
import Alert from "../components/Alert"

function ContactPage() {
  const [admins, setAdmins] = useState([])
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAdmins()
        setAdmins(data)
      } catch (e) {
        console.error("Error fetching admins", e)
        setError("A apărut o eroare la încărcarea datelor.")
      } finally {
        setLoading(false)
      }
    }
    fetchAdmins()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim() || admins.length === 0) return
    try {
      setSending(true)
      const adminId = admins[0].id_utilizator
      const conv = await createConversation(adminId)
      await sendMessage({ id_conversatie: conv.id_conversatie, continut: question })
      navigate(`/messages/${conv.id_conversatie}`)
    } catch (err) {
      console.error("Error sending question", err)
      setError("A apărut o eroare la trimiterea întrebării.")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Se încarcă...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trimite o întrebare</h1>
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Textarea
          id="question"
          label="Întrebarea ta"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={5}
          required
        />
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={sending || !question.trim()}>
            {sending ? "Se trimite..." : "Trimite"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ContactPage
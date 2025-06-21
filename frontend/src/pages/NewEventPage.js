"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createEvent } from "../services/socialService"
import Card from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import Textarea from "../components/Textarea"
import Alert from "../components/Alert"
import { useAuth } from "../contexts/AuthContext"

function NewEventPage() {
  const [formData, setFormData] = useState({
    titlu: "",
    continut: "",
    data_eveniment: "",
    locatie: "",
    nr_maxim_participanti: "",
    alte_detalii: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { isPremium } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!isPremium) return
    try {
      setIsSubmitting(true)
      const event = await createEvent({
        ...formData,
        nr_maxim_participanti: formData.nr_maxim_participanti
          ? Number.parseInt(formData.nr_maxim_participanti)
          : undefined,
      })
      setSuccess(true)
      navigate("/events")
    } catch (err) {
      console.error("Error creating event:", err)
      setError(err.response?.data?.error || "A apărut o eroare.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isPremium) {
    return (
      <Alert type="error" className="my-8">
        Doar utilizatorii premium pot crea evenimente.
      </Alert>
    )
  }

  return (
    <div>
      <Card className="max-w-xl mx-auto">
        <Card.Header>
          <h1 className="text-2xl font-semibold">Creează eveniment nou</h1>
        </Card.Header>
        <Card.Body>
          {success && (
            <Alert type="success" className="mb-4">
              Evenimentul a fost trimis spre aprobare.
            </Alert>
          )}
          {error && (
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              label="Titlu"
              id="titlu"
              name="titlu"
              value={formData.titlu}
              onChange={handleChange}
              required
            />
            <Textarea
              label="Descriere"
              id="continut"
              name="continut"
              value={formData.continut}
              onChange={handleChange}
              rows={4}
            />
            <Input
              label="Data și ora"
              id="data_eveniment"
              name="data_eveniment"
              type="datetime-local"
              value={formData.data_eveniment}
              onChange={handleChange}
              required
            />
            <Input
              label="Locație"
              id="locatie"
              name="locatie"
              value={formData.locatie}
              onChange={handleChange}
            />
            <Input
              label="Număr maxim participanți"
              id="nr_maxim_participanti"
              name="nr_maxim_participanti"
              type="number"
              value={formData.nr_maxim_participanti}
              onChange={handleChange}
              min="1"
            />
            <Textarea
              label="Alte detalii"
              id="alte_detalii"
              name="alte_detalii"
              value={formData.alte_detalii}
              onChange={handleChange}
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Se creează..." : "Creează eveniment"}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default NewEventPage
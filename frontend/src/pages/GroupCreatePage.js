"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createGroup } from "../services/socialService"
import Card from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import Textarea from "../components/Textarea"
import Alert from "../components/Alert"
import { useAuth } from "../contexts/AuthContext"

function GroupCreatePage() {
  const [formData, setFormData] = useState({
    nume: "",
    descriere: "",
    
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { isPremium } = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!isPremium) return
    try {
      setIsSubmitting(true)
      const group = await createGroup(formData)
      navigate(`/groups/${group.id_grup}`)
    } catch (err) {
      console.error("Error creating group:", err)
      setError(err.response?.data?.error || "A apărut o eroare.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isPremium) {
    return (
      <Alert type="error" className="my-8">
        Doar utilizatorii premium pot crea grupuri.
      </Alert>
    )
  }

  return (
    <div>
      <Card className="max-w-xl mx-auto">
        <Card.Header>
          <h1 className="text-2xl font-semibold">Creează grup nou</h1>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              label="Nume grup"
              id="nume"
              name="nume"
              value={formData.nume}
              onChange={handleChange}
              required
            />
            <Textarea
              label="Descriere"
              id="descriere"
              name="descriere"
              value={formData.descriere}
              onChange={handleChange}
              rows={4}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Se creează..." : "Creează grup"}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default GroupCreatePage
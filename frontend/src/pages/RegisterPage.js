"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import Alert from "../components/Alert"

function RegisterPage() {
  const [formData, setFormData] = useState({
    nume: "",
    email: "",
    parola: "",
    confirmaParola: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (formData.parola !== formData.confirmaParola) {
      return setError("Parolele nu coincid")
    }

    if (formData.parola.length < 6) {
      return setError("Parola trebuie să aibă cel puțin 6 caractere")
    }

    try {
      setLoading(true)
      await register({
        nume: formData.nume,
        email: formData.email,
        parola: formData.parola,
      })
      navigate("/")
    } catch (error) {
      setError(error.message || "Failed to create an account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Înregistrare</h1>

      <Card>
        <Card.Body>
          {error && (
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Nume"
              id="nume"
              name="nume"
              value={formData.nume}
              onChange={handleChange}
              required
              autoComplete="name"
            />

            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <Input
              label="Parolă"
              id="parola"
              name="parola"
              type="password"
              value={formData.parola}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirmă parola"
              id="confirmaParola"
              name="confirmaParola"
              type="password"
              value={formData.confirmaParola}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Se procesează..." : "Înregistrare"}
            </Button>
          </form>
        </Card.Body>

        <Card.Footer className="text-center">
          <p>
            Ai deja cont?{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-800">
              Autentifică-te
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  )
}

export default RegisterPage

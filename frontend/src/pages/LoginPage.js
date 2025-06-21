"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import Alert from "../components/Alert"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the redirect path from location state or default to dashboard
 const from = location.state?.from?.pathname || "/dashboard"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Toate câmpurile sunt obligatorii")
      return
    }

    try {
      setLoading(true)
      if (process.env.NODE_ENV === "development") {
        console.log("Submitting login with:", { email, password })
      }      
      await login(email, password)
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Login error in component:", error)
      setError(typeof error === "string" ? error : "Autentificare eșuată. Verificați email-ul și parola.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Autentificare</h1>

      <Card>
        <Card.Body>
          {error && (
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Parolă"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Se procesează..." : "Autentificare"}
            </Button>
          </form>
        </Card.Body>

        <Card.Footer className="text-center">
          <p>
            Nu ai cont?{" "}
            <Link to="/register" className="text-primary-600 hover:text-primary-800">
              Înregistrează-te
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  )
}

export default LoginPage

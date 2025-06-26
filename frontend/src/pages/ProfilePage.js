"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import Alert from "../components/Alert"

function ProfilePage() {
  const { currentUser, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nume: currentUser?.nume || "",
    email: currentUser?.email || "",
    parola: "",
    confirmaParola: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      setError("A apărut o eroare la deconectare")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate form
    if (formData.parola && formData.parola !== formData.confirmaParola) {
      return setError("Parolele nu coincid")
    }

    if (formData.parola && formData.parola.length < 6) {
      return setError("Parola trebuie să aibă cel puțin 6 caractere")
    }

    try {
      setLoading(true)
      const updateData = {
        nume: formData.nume,
      }

      if (formData.parola) {
        updateData.parola = formData.parola
      }

      await updateProfile(updateData)
      setSuccess("Profilul a fost actualizat cu succes")
      setFormData((prev) => ({
        ...prev,
        parola: "",
        confirmaParola: "",
      }))
    } catch (error) {
      setError(error.message || "A apărut o eroare la actualizarea profilului")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Profilul meu</h1>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profilul meu</h1>
        <Button 
          onClick={handleLogout}
          variant="secondary"
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Deconectare
        </Button>
      </div>

      <Card className="mb-8">
        <Card.Header>
          <h2 className="text-xl font-semibold">Informații cont</h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Nume</p>
              <p className="font-medium">{currentUser?.nume}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{currentUser?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tip cont</p>
              <p className="font-medium capitalize">{currentUser?.rol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data înregistrării</p>
              <p className="font-medium">{new Date(currentUser?.data_inregistrare).toLocaleDateString("ro-RO")}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Editează profilul</h2>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
          )}
          {success && (
            <Alert type="success" className="mb-4">
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Input label="Nume" id="nume" name="nume" value={formData.nume} onChange={handleChange} required />

            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="opacity-70"
            />

            <div className="border-t border-gray-200 my-6 pt-6">
              <h3 className="text-lg font-medium mb-4">Schimbă parola</h3>
              <p className="text-sm text-gray-500 mb-4">Completează doar dacă dorești să schimbi parola</p>

              <Input
                label="Parolă nouă"
                id="parola"
                name="parola"
                type="password"
                value={formData.parola}
                onChange={handleChange}
              />

              <Input
                label="Confirmă parola nouă"
                id="confirmaParola"
                name="confirmaParola"
                type="password"
                value={formData.confirmaParola}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Se procesează..." : "Salvează modificările"}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ProfilePage

"use client"

import { useState, useEffect } from "react"
import Card from "../../components/Card"
import Button from "../../components/Button"
import Alert from "../../components/Alert"
import Input from "../../components/Input"
import Textarea from "../../components/Textarea"
import api from "../../services/api"

function SpecializationsPage() {
  const [specializations, setSpecializations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingSpecialization, setEditingSpecialization] = useState(null)
  const [formData, setFormData] = useState({
    nume_specializare: "",
    descriere: "",
  })

  useEffect(() => {
    fetchSpecializations()
  }, [])

  const fetchSpecializations = async () => {
    try {
      setLoading(true)
      const response = await api.get("/specializari/getAll")
      setSpecializations(response.data)
    } catch (error) {
      console.error("Error fetching specializations:", error)
      setError("A apărut o eroare la încărcarea specializărilor.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditSpecialization = (specialization) => {
    setEditingSpecialization(specialization)
    setFormData({
      nume_specializare: specialization.nume_specializare,
      descriere: specialization.descriere || "",
    })
  }

  const handleCancelEdit = () => {
    setEditingSpecialization(null)
    setFormData({
      nume_specializare: "",
      descriere: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSpecialization) {
        await api.put(`/specializari/update/${editingSpecialization.id_specializare}`, formData)
        setSuccess(`Specializarea ${formData.nume_specializare} a fost actualizată cu succes.`)
      } else {
        await api.post("/specializari/create", formData)
        setSuccess(`Specializarea ${formData.nume_specializare} a fost creată cu succes.`)
      }
      fetchSpecializations()
      handleCancelEdit()
    } catch (error) {
      console.error("Error saving specialization:", error)
      setError(error.response?.data?.error || "A apărut o eroare la salvarea specializării.")
    }
  }

  const handleDeleteSpecialization = async (id, name) => {
    if (!window.confirm(`Sigur doriți să ștergeți specializarea "${name}"?`)) {
      return
    }

    try {
      await api.delete(`/specializari/delete/${id}`)
      setSuccess(`Specializarea ${name} a fost ștearsă cu succes.`)
      fetchSpecializations()
    } catch (error) {
      console.error("Error deleting specialization:", error)
      setError(error.response?.data?.error || "A apărut o eroare la ștergerea specializării.")
    }
  }

  if (loading && specializations.length === 0) {
    return <div className="text-center py-8">Se încarcă specializările...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionare specializări</h1>

      {error && (
        <Alert type="error" className="mb-6" dismissible onDismiss={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" className="mb-6" dismissible onDismiss={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Card className="mb-8">
        <Card.Header>
          <h2 className="text-xl font-semibold">
            {editingSpecialization ? "Editare specializare" : "Adaugă specializare nouă"}
          </h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Input
              label="Nume specializare"
              id="nume_specializare"
              name="nume_specializare"
              value={formData.nume_specializare}
              onChange={handleInputChange}
              required
            />

            <Textarea
              label="Descriere"
              id="descriere"
              name="descriere"
              value={formData.descriere}
              onChange={handleInputChange}
              rows={4}
            />

            <div className="flex justify-end mt-4 space-x-2">
              {editingSpecialization && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Anulează
                </Button>
              )}
              <Button type="submit">{editingSpecialization ? "Actualizează" : "Adaugă"}</Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Lista specializărilor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specializations.map((specialization) => (
          <Card key={specialization.id_specializare}>
            <Card.Body>
              <h3 className="text-xl font-bold mb-2">{specialization.nume_specializare}</h3>
              {specialization.descriere && <p className="text-gray-600 mb-4">{specialization.descriere}</p>}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditSpecialization(specialization)}>
                  Editează
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    handleDeleteSpecialization(specialization.id_specializare, specialization.nume_specializare)
                  }
                >
                  Șterge
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {specializations.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">Nu există specializări disponibile.</p>
        </div>
      )}
    </div>
  )
}

export default SpecializationsPage

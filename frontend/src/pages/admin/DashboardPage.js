"use client"

import { useState, useEffect } from "react"
import { getFaqs, createFaq, updateFaq, deleteFaq } from "../../services/faqService"
import Card from "../../components/Card"
import Button from "../../components/Button"
import Alert from "../../components/Alert"
import Input from "../../components/Input"
import Textarea from "../../components/Textarea"

function FaqPage() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingFaq, setEditingFaq] = useState(null)
  const [formData, setFormData] = useState({
    intrebare: "",
    raspuns: "",
  })

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const data = await getFaqs()
      setFaqs(data)
    } catch (error) {
      console.error("Error fetching FAQs:", error)
      setError("A apărut o eroare la încărcarea întrebărilor frecvente.")
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

  const handleEditFaq = (faq) => {
    setEditingFaq(faq)
    setFormData({
      intrebare: faq.intrebare,
      raspuns: faq.raspuns,
    })
  }

  const handleCancelEdit = () => {
    setEditingFaq(null)
    setFormData({
      intrebare: "",
      raspuns: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingFaq) {
        await updateFaq(editingFaq.id_faq, formData)
        setSuccess("Întrebarea a fost actualizată cu succes.")
      } else {
        await createFaq(formData)
        setSuccess("Întrebarea a fost adăugată cu succes.")
      }
      fetchFaqs()
      handleCancelEdit()
    } catch (error) {
      console.error("Error saving FAQ:", error)
      setError(error.response?.data?.error || "A apărut o eroare la salvarea întrebării.")
    }
  }

  const handleDeleteFaq = async (id) => {
    if (!window.confirm("Sigur doriți să ștergeți această întrebare?")) {
      return
    }

    try {
      await deleteFaq(id)
      setSuccess("Întrebarea a fost ștearsă cu succes.")
      fetchFaqs()
    } catch (error) {
      console.error("Error deleting FAQ:", error)
      setError(error.response?.data?.error || "A apărut o eroare la ștergerea întrebării.")
    }
  }

  if (loading && faqs.length === 0) {
    return <div className="text-center py-8">Se încarcă întrebările frecvente...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionare întrebări frecvente</h1>

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
          <h2 className="text-xl font-semibold">{editingFaq ? "Editare întrebare" : "Adaugă întrebare nouă"}</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Input
              label="Întrebare"
              id="intrebare"
              name="intrebare"
              value={formData.intrebare}
              onChange={handleInputChange}
              required
            />

            <Textarea
              label="Răspuns"
              id="raspuns"
              name="raspuns"
              value={formData.raspuns}
              onChange={handleInputChange}
              rows={6}
              required
            />

            <div className="flex justify-end mt-4 space-x-2">
              {editingFaq && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Anulează
                </Button>
              )}
              <Button type="submit">{editingFaq ? "Actualizează" : "Adaugă"}</Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Lista întrebărilor frecvente</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id_faq}>
            <Card.Body>
              <h3 className="text-xl font-bold mb-2">{faq.intrebare}</h3>
              <p className="text-gray-600 mb-4 whitespace-pre-line">{faq.raspuns}</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditFaq(faq)}>
                  Editează
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteFaq(faq.id_faq)}>
                  Șterge
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">Nu există întrebări frecvente disponibile.</p>
        </div>
      )}
    </div>
  )
}

export default FaqPage

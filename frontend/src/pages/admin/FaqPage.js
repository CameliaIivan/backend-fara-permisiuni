"use client"

import { useState, useEffect } from "react"
import { getFaqs } from "../../services/faqService"
import Card from "../../components/Card"
import Alert from "../../components/Alert"
import Button from "../../components/Button"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

function FaqPage() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedId, setExpandedId] = useState(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true)
        const data = await getFaqs()
        setFaqs(data)
      } catch (error) {
        console.error("Error fetching FAQs:", error)
        setError("A apărut o eroare la încărcarea întrebărilor frecvente. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return <div className="text-center py-8">Se încarcă întrebările frecvente...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Întrebări frecvente</h1>
        {isAdmin && (
          <Link to="/admin">
            <Button>Adaugă întrebare</Button>
          </Link>
        )}
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">Nu există întrebări frecvente disponibile.</p>
          </div>
        ) : (
          faqs.map((faq) => (
            <Card key={faq.id_faq}>
              <button
                className="w-full text-left px-6 py-4 focus:outline-none"
                onClick={() => toggleFaq(faq.id_faq)}
                aria-expanded={expandedId === faq.id_faq}
                aria-controls={`faq-content-${faq.id_faq}`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{faq.intrebare}</h2>
                  <span className="text-2xl">{expandedId === faq.id_faq ? "−" : "+"}</span>
                </div>
              </button>
              {expandedId === faq.id_faq && (
                <div id={`faq-content-${faq.id_faq}`} className="px-6 py-4 border-t border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">{faq.raspuns}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default FaqPage

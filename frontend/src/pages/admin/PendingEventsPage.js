"use client"

import { useState, useEffect } from "react"
import { getPendingEvents, approveEvent, deleteEvent } from "../../services/socialService"
import Card from "../../components/Card"
import Button from "../../components/Button"
import Alert from "../../components/Alert"
import { Link } from "react-router-dom"

function PendingEventsPage() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchData = async () => {
    try {
      const data = await getPendingEvents()
      setEvents(data)
    } catch (err) {
      setError("Nu s-au putut încărca evenimentele")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async (id) => {
    if (!window.confirm("Aprobați acest eveniment?")) return
    try {
      await approveEvent(id)
      setSuccess("Evenimentul a fost aprobat")
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error || "Eroare la aprobare")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Ștergeți acest eveniment?")) return
    try {
      await deleteEvent(id)
      setSuccess("Evenimentul a fost șters")
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error || "Eroare la ștergere")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Evenimente în așteptare</h1>
      {error && (
        <Alert type="error" className="mb-6" dismissible onDismiss={() => setError("")}>{error}</Alert>
      )}
      {success && (
        <Alert type="success" className="mb-6" dismissible onDismiss={() => setSuccess("")}>{success}</Alert>
      )}
      {events.length === 0 ? (
        <p>Nu există evenimente de aprobat.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id_eveniment}>
              <Card.Body>
                <h2 className="text-xl font-bold mb-2">{event.postare?.titlu}</h2>
                <p className="text-gray-600 mb-2">{event.postare?.continut}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(event.data_eveniment).toLocaleString("ro-RO")}
                </p>
                <div className="flex justify-end space-x-2">
                  <Link to={`/events/${event.id_eveniment}`}> 
                    <Button variant="outline" size="sm">Vezi</Button>
                  </Link>
                  <Button variant="success" size="sm" onClick={() => handleApprove(event.id_eveniment)}>
                    Aproba</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(event.id_eveniment)}>
                    Șterge</Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default PendingEventsPage
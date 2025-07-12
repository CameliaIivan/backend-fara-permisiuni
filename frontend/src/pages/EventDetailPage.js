"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getEventById, joinEvent, leaveEvent , approveEvent, rejectEvent} from "../services/socialService"
import Card from "../components/Card"
import Button from "../components/Button"
import Alert from "../components/Alert"
import { useAuth } from "../contexts/AuthContext"

function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const { currentUser, isPremium } = useAuth()
  const [adminLoading, setAdminLoading] = useState(false)

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true)
        const data = await getEventById(id)
        console.log("Eveniment data :", data)
        setEvent(data)
        setParticipants(data.ParticipareEveniments || [])
      } catch (error) {
        console.error("Error fetching event data:", error)
        setError("A apărut o eroare la încărcarea datelor evenimentului. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [id])

  const handleJoinEvent = async () => {
    try {
      setIsJoining(true)
      await joinEvent(event.id_eveniment)
      // Refresh event data to get updated participants list
      const updatedEvent = await getEventById(id)
      setEvent(updatedEvent)
       setParticipants(updatedEvent.ParticipareEveniments || [])
    } catch (error) {
      console.error("Error joining event:", error)
      setError("A apărut o eroare la înscrierea la eveniment. Vă rugăm încercați din nou.")
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveEvent = async () => {
    try {
      setIsJoining(true)
      await leaveEvent(event.id_eveniment)
      // Refresh event data to get updated participants list
      const updatedEvent = await getEventById(id)
      setEvent(updatedEvent)
      setParticipants(updatedEvent.ParticipareEveniments || [])
    } catch (error) {
      console.error("Error leaving event:", error)
      setError("A apărut o eroare la anularea participării. Vă rugăm încercați din nou.")
    } finally {
      setIsJoining(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Se încarcă datele evenimentului...</div>
  }

  if (error) {
    return (
      <Alert type="error" className="my-8">
        {error}
      </Alert>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Evenimentul nu a fost găsit</h2>
        <Link to="/events">
          <Button>Înapoi la evenimente</Button>
        </Link>
      </div>
    )
  }

  const isParticipant = currentUser && participants.some((p) => p.id_utilizator === currentUser.id)
  const postareData = event.postare || event.Postare
  const isCreator = currentUser && postareData && postareData.creat_de === currentUser.id
  const isEventFull = event.nr_maxim_participanti && participants.length >= event.nr_maxim_participanti
  const eventDate = new Date(event.data_eveniment)
  const isPastEvent = eventDate < new Date()
  const handleAdminApprove = async () => {
        if (!window.confirm("Aprobați acest eveniment?")) return
        try {
          setAdminLoading(true)
        await approveEvent(event.id_eveniment)
        setEvent({ ...event, aprobat: true })
        } catch (err) {
          console.error(err)
        } finally {
       setAdminLoading(false)
        }
       }

  const handleAdminReject = async () => {
      if (!window.confirm("Respingeți acest eveniment?")) return
      try {
        setAdminLoading(true)
      await rejectEvent(event.id_eveniment)
      setEvent({ ...event, respins: true })
      } catch (err) {
        console.error(err)
      } finally {
       setAdminLoading(false)
      }        
       }
  

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link to="/events">
          <Button variant="outline">&larr; Înapoi la evenimente</Button>
        </Link>
        {(isCreator || isPremium) && !isPastEvent && (
          <Link to={`/events/edit/${event.id_eveniment}`}>
            <Button>Editează evenimentul</Button>
          </Link>
        )}
      </div>

      <Card className="mb-8">
        <Card.Body>
          <div className="flex items-start mb-6">
            <div className="bg-secondary-100 text-secondary-800 rounded-lg p-3 mr-4 text-center min-w-[80px]">
              <div className="text-2xl font-bold">{eventDate.getDate()}</div>
              <div className="text-sm">
                {eventDate.toLocaleDateString("ro-RO", { month: "short", year: "numeric" })}
              </div>
              <div className="text-sm mt-1">
                {eventDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div>
               <h1 className="text-3xl font-bold mb-2">{postareData?.titlu || "Eveniment fără titlu"}</h1>
              <p className="text-gray-600">
                {event.locatie && (
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {event.locatie}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Descriere</h2>
             <p className="whitespace-pre-line">{postareData?.continut || "Fără descriere"}</p>
          </div>

          {event.alte_detalii && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Detalii suplimentare</h2>
              <p className="whitespace-pre-line">{event.alte_detalii}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                Organizator:{" "}
                 <span className="font-medium">{postareData?.utilizator?.nume || postareData?.User?.nume || "Utilizator necunoscut"}</span>
              </p>
              <p className="text-gray-600">
                Participanți: {participants.length}
                {event.nr_maxim_participanti && ` / ${event.nr_maxim_participanti}`}
              </p>
            </div>
            {currentUser && !isPastEvent && (
              <div>
                {isParticipant ? (
                  <Button variant="outline" onClick={handleLeaveEvent} disabled={isJoining || isCreator}>
                    {isJoining ? "Se procesează..." : "Anulează participarea"}
                  </Button>
                ) : (
                  <Button onClick={handleJoinEvent} disabled={isJoining || isEventFull}>
                    {isJoining ? "Se procesează..." : isEventFull ? "Eveniment complet" : "Participă la eveniment"}
                  </Button>
                )}
              </div>
            )}
          </div>
          {currentUser?.rol === "admin" && !event.aprobat && !event.respins && (
  <div className="flex space-x-2 mt-4">
    <Button
      variant="success"
      onClick={handleAdminApprove}
      disabled={adminLoading}
    >
      {adminLoading ? "Se procesează..." : "Aprobă eveniment"}
    </Button>
    <Button
      variant="danger"
      onClick={handleAdminReject}
      disabled={adminLoading}
    >
      {adminLoading ? "Se procesează..." : "Respinge eveniment"}
    </Button>
  </div>
)}

        </Card.Body>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Participanți</h2>
        {participants.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600">Nu există participanți înscriși la acest eveniment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {participants.map((participant) => (
              <Card key={participant.id_utilizator}>
                <Card.Body className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mr-3">
                     {(participant.utilizator || participant.User)?.nume?.charAt(0) || "?"}
                  </div>
                  <div>
<p className="font-medium">{(participant.utilizator || participant.User)?.nume || "Utilizator necunoscut"}</p>                    <p className="text-sm text-gray-500">
                      Înscris la: {new Date(participant.data_inscriere).toLocaleDateString("ro-RO")}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetailPage

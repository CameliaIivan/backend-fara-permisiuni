"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getEvents } from "../services/socialService"
import Card from "../components/Card"
import Button from "../components/Button"
import Alert from "../components/Alert"
import { useAuth } from "../contexts/AuthContext"

function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { isPremium } = useAuth()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await getEvents()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        setError("A apărut o eroare la încărcarea evenimentelor. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Group events by month
  const groupEventsByMonth = (events) => {
    const grouped = {}

    events.forEach((event) => {
      const date = new Date(event.data_eveniment)
      const monthYear = `${date.getMonth()}-${date.getFullYear()}`

      if (!grouped[monthYear]) {
        grouped[monthYear] = {
          monthName: date.toLocaleDateString("ro-RO", { month: "long", year: "numeric" }),
          events: [],
        }
      }

      grouped[monthYear].events.push(event)
    })

    // Sort by date
    Object.keys(grouped).forEach((key) => {
      grouped[key].events.sort((a, b) => new Date(a.data_eveniment) - new Date(b.data_eveniment))
    })

    return grouped
  }

  const groupedEvents = groupEventsByMonth(events)

  if (loading) {
    return <div className="text-center py-8">Se încarcă evenimentele...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Evenimente</h1>
        {isPremium && (
          <Link to="/events/new">
            <Button>Creează eveniment nou</Button>
          </Link>
        )}
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">Nu există evenimente disponibile momentan.</p>
          {isPremium && (
            <Link to="/events/new">
              <Button>Creează primul eveniment</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedEvents).map((monthYear) => (
            <div key={monthYear}>
              <h2 className="text-2xl font-semibold mb-4">{groupedEvents[monthYear].monthName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedEvents[monthYear].events.map((event) => (
                  <Card key={event.id_eveniment}>
                    <Card.Body>
                      <div className="flex items-start mb-4">
                        <div className="bg-secondary-100 text-secondary-800 rounded-lg p-2 mr-4 text-center min-w-[60px]">
                          <div className="text-xl font-bold">{new Date(event.data_eveniment).getDate()}</div>
                          <div className="text-sm">
                            {new Date(event.data_eveniment).toLocaleDateString("ro-RO", { month: "short" })}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                          {event.postare && event.postare.titlu ? event.postare.titlu : "Eveniment fără titlu"}
                          </h3>
                            <p className="text-gray-600 mb-4">
                            {event.postare && event.postare.continut
                              ? event.postare.continut.length > 100
                                  ? `${event.postare.continut.substring(0, 100)}...`
                                 : event.postare.continut
                                        : "Fără descriere"}
                                  </p>
                        </div>
                      </div>
                      {/* <p className="text-gray-600 mb-4">
                        {event.postare?.continut
                          ? event.postare.continut.length > 100
                            ? `${event.postare.continut.substring(0, 100)}...`
                            : event.postare.continut
                          : "Fără descriere"}
                      </p> */}
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {event.nr_maxim_participanti && <span>Max: {event.nr_maxim_participanti} participanți</span>}
                        </div>
                        <Link to={`/events/${event.id_eveniment}`}>
                          <Button variant="outline" size="sm">
                            Vezi detalii
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventsPage

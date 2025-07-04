"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getGroups } from "../services/socialService"
import Card from "../components/Card"
import Button from "../components/Button"
import Alert from "../components/Alert"
import { useAuth } from "../contexts/AuthContext"

function GroupsPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { currentUser, isPremium } = useAuth()

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        const data = await getGroups()
        setGroups(data)
      } catch (error) {
        console.error("Error fetching groups:", error)
        setError("A apărut o eroare la încărcarea grupurilor. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Se încarcă grupurile...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Grupuri</h1>
        {isPremium && (
          <Link to="/groups/new">
            <Button>Creează grup nou</Button>
          </Link>
        )}
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {!currentUser && (
        <Alert type="info" className="mb-6">
          <p>
            Trebuie să fii autentificat pentru a vedea toate grupurile și pentru a participa la discuții.{" "}
            <Link to="/login" className="text-primary-600 hover:underline">
              Autentifică-te
            </Link>{" "}
            sau{" "}
            <Link to="/register" className="text-primary-600 hover:underline">
              Înregistrează-te
            </Link>
          </p>
        </Alert>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">Nu există grupuri disponibile momentan.</p>
          {isPremium && (
            <Link to="/groups/new">
              <Button>Creează primul grup</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id_grup}>
              <Card.Body>
                <h2 className="text-xl font-bold mb-2">{group.nume}</h2>
                <p className="text-gray-600 mb-4">
                  {group.descriere ? (
                    group.descriere.length > 100 ? (
                      `${group.descriere.substring(0, 100)}...`
                    ) : (
                      group.descriere
                    )
                  ) : (
                    <span className="text-gray-400">Fără descriere</span>
                  )}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {group.este_privata ? (
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Grup privat
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Grup public
                      </span>
                    )}
                  </div>
                  <Link to={`/groups/${group.id_grup}`}>
                    <Button variant="outline" size="sm">
                      Vezi detalii
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default GroupsPage

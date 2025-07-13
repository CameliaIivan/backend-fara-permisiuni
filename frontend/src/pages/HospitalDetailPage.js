"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { getHospitalById } from "../services/hospitalService"
import Card from "../components/Card"
import Button from "../components/Button"
import Alert from "../components/Alert"
import { useAuth } from "../contexts/AuthContext"
import "leaflet/dist/leaflet.css"

// Fix for Leaflet marker icons
import L from "leaflet"
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

function HospitalDetailPage() {
  const { id } = useParams()
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { isAdmin } = useAuth()

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true)
        const data = await getHospitalById(id)
        setHospital(data)
      } catch (error) {
        console.error("Error fetching hospital:", error)
        setError("A apărut o eroare la încărcarea datelor spitalului. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }

    fetchHospital()
  }, [id])

  // Return coordinates saved for the hospital or fall back to Romania center
  const getHospitalCoordinates = () => {
     if (hospital && hospital.latitudine && hospital.longitudine) {
      return [Number(hospital.latitudine), Number(hospital.longitudine)]
    }
    return [45.9443, 25.0094] // Default coordinates for Romania
  }

  if (loading) {
    return <div className="text-center py-8">Se încarcă datele spitalului...</div>
  }

  if (error) {
    return (
      <Alert type="error" className="my-8">
        {error}
      </Alert>
    )
  }

  if (!hospital) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Spitalul nu a fost găsit</h2>
        <Link to="/hospitals">
          <Button>Înapoi la spitale</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link to="/hospitals">
          <Button variant="outline">&larr; Înapoi la spitale</Button>
        </Link>
        {isAdmin && (
          <Link
            to="/admin/hospitals"
            state={{ editHospitalId: hospital.id_spital }}
          >
            <Button>Editează spitalul</Button>
          </Link>
        )}
      </div>

      <Card className="mb-8">
        <Card.Body>
          <h1 className="text-3xl font-bold mb-4">{hospital.nume}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Informații generale</h2>
              <p className="mb-2">
                <strong>Locație:</strong> {hospital.locatie}
              </p>
              {hospital.tip_serviciu && (
                <p className="mb-2">
                  <strong>Tip serviciu:</strong> {hospital.tip_serviciu}
                </p>
              )}
              {hospital.grad_accesibilitate && (
                <p className="mb-2">
                  <strong>Grad de accesibilitate:</strong> {hospital.grad_accesibilitate}
                </p>
              )}
              {hospital.contact && (
                <p className="mb-2">
                  <strong>Contact:</strong> {hospital.contact}
                </p>
              )}
              {hospital.website && (
                <p className="mb-2">
                  <strong>Website:</strong>{" "}
                  <a
                    href={hospital.website.startsWith("http") ? hospital.website : `http://${hospital.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {hospital.website}
                  </a>
                </p>
              )}
            </div>
            <div>
              {hospital.specializari && hospital.specializari.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Specializări</h2>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specializari.map((spec) => (
                      <span
                        key={spec.id_specializare}
                        className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full"
                      >
                        {spec.nume_specializare}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {hospital.descriere && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Descriere</h2>
              <p className="whitespace-pre-line">{hospital.descriere}</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Locație</h2>
        <div className="h-96 rounded-lg overflow-hidden shadow-md">
          <MapContainer center={getHospitalCoordinates()} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={getHospitalCoordinates()}>
              <Popup>{hospital.nume}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default HospitalDetailPage

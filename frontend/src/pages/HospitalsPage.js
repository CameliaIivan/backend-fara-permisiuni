"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getHospitals, getSpecializations } from "../services/hospitalService"
import Card from "../components/Card"
import Button from "../components/Button"
import Alert from "../components/Alert"
import Input from "../components/Input"
import Select from "../components/Select"
import { useAuth } from "../contexts/AuthContext"

function HospitalsPage() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [specializations, setSpecializations] = useState([])
  const [error, setError] = useState("")
  const { isAdmin } = useAuth()
  const [filters, setFilters] = useState({
    nume: "",
    locatie: "",
    id_specializare: "",
    grad_accesibilitate: "",
  })

  useEffect(() => {
      const fetchData = async () => {
      try {
        setLoading(true)
        const [hospitalsData, specializationsData] = await Promise.all([
          getHospitals(),
          getSpecializations(),
        ])
        setHospitals(hospitalsData)
        setSpecializations(specializationsData)
      } catch (error) {
        console.error("Error fetching hospitals:", error)
        setError(
          "A apărut o eroare la încărcarea spitalelor. Vă rugăm încercați din nou."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Filter hospitals based on filters
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesName = !filters.nume || hospital.nume.toLowerCase().includes(filters.nume.toLowerCase())
    const matchesLocation = !filters.locatie || hospital.locatie.toLowerCase().includes(filters.locatie.toLowerCase())
    const matchesAccessibility =
      !filters.grad_accesibilitate || hospital.grad_accesibilitate === filters.grad_accesibilitate
    const matchesSpecialization =
      !filters.id_specializare ||
      (hospital.specializari &&
        hospital.specializari.some(
          (spec) => spec.id_specializare === Number(filters.id_specializare)
        ))
    return (
      matchesName &&
      matchesLocation &&
      matchesAccessibility &&
      matchesSpecialization
    )
  })

  if (loading) {
    return <div className="text-center py-8">Se încarcă spitalele...</div>
  }

  return (
    <div>
     <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Spitale și clinici</h1>
        {isAdmin && (
          <Link to="/admin/hospitals">
            <Button>Adaugă spital</Button>
          </Link>
        )}
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <Card className="mb-6">
        <Card.Body>
          <h2 className="text-xl font-semibold mb-4">Filtrează spitale</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Nume spital"
              id="nume"
              name="nume"
              value={filters.nume}
              onChange={handleFilterChange}
              placeholder="Caută după nume"
            />

             <Input
            label="Locație"
            id="locatie"
            name="locatie"
            value={filters.locatie}
            onChange={handleFilterChange}
            placeholder="Oraș, județ"
          />

          <Select
            label="Specializare"
            id="id_specializare"
            name="id_specializare"
            value={filters.id_specializare}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "Toate specializările" },
              ...specializations.map((spec) => ({
                value: spec.id_specializare,
                label: spec.nume_specializare,
              })),
            ]}
          />
          <Select
            label="Grad de accesibilitate"
            id="grad_accesibilitate"
            name="grad_accesibilitate"
              value={filters.grad_accesibilitate}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "Toate" },
                { value: "ridicat", label: "Ridicat" },
                { value: "mediu", label: "Mediu" },
                { value: "scazut", label: "Scăzut" },
              ]}
              />
          </div>
        </Card.Body>
      </Card>

      {filteredHospitals.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">Nu s-au găsit spitale care să corespundă criteriilor de filtrare.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id_spital}>
              <Card.Body>
                <h2 className="text-xl font-bold mb-2">{hospital.nume}</h2>
                <p className="text-gray-600 mb-2">{hospital.locatie}</p>
                {hospital.grad_accesibilitate && (
                  <p className="mb-4">
                    <span className="font-medium">Grad de accesibilitate:</span>{" "}
                    <span className="capitalize">{hospital.grad_accesibilitate}</span>
                  </p>
                )}
                {hospital.tip_serviciu && (
                  <p className="mb-4">
                    <span className="font-medium">Tip serviciu:</span> {hospital.tip_serviciu}
                  </p>
                )}
                {hospital.specializari && hospital.specializari.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {hospital.specializari.map((spec) => (
                      <span
                        key={spec.id_specializare}
                        className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded"
                      >
                        {spec.nume_specializare}
                      </span>
                    ))}
                  </div>
                )}
                <Link to={`/hospitals/${hospital.id_spital}`}>
                  <Button variant="outline" className="w-full">
                    Vezi detalii
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default HospitalsPage

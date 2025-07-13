"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { getHospitals, getSpecializations, createHospital, updateHospital, deleteHospital } from "../../services/hospitalService"
import Card from "../../components/Card"
import Button from "../../components/Button"
import Alert from "../../components/Alert"
import Select from "../../components/Select"
import Input from "../../components/Input"
import Textarea from "../../components/Textarea"

function HospitalsPage() {
  const [hospitals, setHospitals] = useState([])
  const [specializations, setSpecializations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  const [editingHospital, setEditingHospital] = useState(null)
  const [formData, setFormData] = useState({
    nume: "",
    locatie: "",
    tip_serviciu: "",
    grad_accesibilitate: "",
    contact: "",
    website: "",
     latitudine: "",
    longitudine: "",
    descriere: "",
    specializari: [],
  })
  const [filters, setFilters] = useState({
    nume: "",
    locatie: "",
    id_specializare: "",
    grad_accesibilitate: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  // If navigated with an editHospitalId state, open the edit form automatically
  useEffect(() => {
    if (location.state?.editHospitalId && hospitals.length > 0) {
      const hospital = hospitals.find(
        (h) => h.id_spital === Number(location.state.editHospitalId)
      )
      if (hospital) {
        handleEditHospital(hospital)
        navigate(".", { replace: true })
      }
    }
  }, [location.state, hospitals])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [hospitalsData, specializationsData] = await Promise.all([getHospitals(), getSpecializations()])
      setHospitals(hospitalsData)
      setSpecializations(specializationsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("A apărut o eroare la încărcarea datelor.")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const applyFilters = () => {
    fetchData()
  }

  const resetFilters = () => {
    setFilters({
      nume: "",
      locatie: "",
      id_specializare: "",
      grad_accesibilitate: "",
    })
  }

  const handleDeleteHospital = async (id, name) => {
    if (!window.confirm(`Sigur doriți să ștergeți spitalul "${name}"?`)) {
      return
    }

    try {
      await deleteHospital(id)
      setSuccess(`Spitalul "${name}" a fost șters cu succes.`)
      fetchData()
    } catch (error) {
      console.error("Error deleting hospital:", error)
      setError(error.response?.data?.error || "A apărut o eroare la ștergerea spitalului.")
    }
  }
   const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSpecializationsChange = (e) => {
    const { value, checked } = e.target
    const id = Number(value)
    setFormData((prev) => {
      let specializari = prev.specializari
      if (checked) {
        if (!specializari.includes(id)) {
          specializari = [...specializari, id]
        }
      } else {
        specializari = specializari.filter((specId) => specId !== id)
      }
      return { ...prev, specializari }
    })
  }

  const handleEditHospital = (hospital) => {
    setEditingHospital(hospital)
    setFormData({
      nume: hospital.nume,
      locatie: hospital.locatie,
      tip_serviciu: hospital.tip_serviciu || "",
      grad_accesibilitate: hospital.grad_accesibilitate || "",
      contact: hospital.contact || "",
      website: hospital.website || "",
      latitudine: hospital.latitudine || "",
      longitudine: hospital.longitudine || "",
      descriere: hospital.descriere || "",
      specializari: hospital.specializari ? hospital.specializari.map((s) => s.id_specializare) : [],
    })
  }

  const handleCancelEdit = () => {
    setEditingHospital(null)
    setFormData({
      nume: "",
      locatie: "",
      tip_serviciu: "",
      grad_accesibilitate: "",
      contact: "",
      website: "",
      latitudine: "",
      longitudine: "",
      descriere: "",
      specializari: [],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingHospital) {
        await updateHospital(editingHospital.id_spital, formData)
        setSuccess(`Spitalul ${formData.nume} a fost actualizat cu succes.`)
      } else {
        await createHospital(formData)
        setSuccess(`Spitalul ${formData.nume} a fost creat cu succes.`)
      }
      fetchData()
      handleCancelEdit()
    } catch (error) {
      console.error("Error saving hospital:", error)
      setError(error.response?.data?.error || "A apărut o eroare la salvarea spitalului.")
    }
  }

  if (loading && hospitals.length === 0) {
    return <div className="text-center py-8">Se încarcă spitalele...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionare spitale</h1>

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
            {editingHospital ? "Editare spital" : "Adaugă spital nou"}
          </h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nume"
                id="nume"
                name="nume"
                value={formData.nume}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Locație"
                id="locatie"
                name="locatie"
                value={formData.locatie}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Tip serviciu"
                id="tip_serviciu"
                name="tip_serviciu"
                value={formData.tip_serviciu}
                onChange={handleInputChange}
              />
              <Select
                label="Grad accesibilitate"
                id="grad_accesibilitate"
                name="grad_accesibilitate"
                value={formData.grad_accesibilitate}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Nespecificat" },
                  { value: "ridicat", label: "Ridicat" },
                  { value: "mediu", label: "Mediu" },
                  { value: "scazut", label: "Scăzut" },
                ]}
              />
              <Input
                label="Contact"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
              <Input
                label="Website"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
              <Input
                label="Latitudine"
                id="latitudine"
                name="latitudine"
                value={formData.latitudine}
                onChange={handleInputChange}
              />
              <Input
                label="Longitudine"
                id="longitudine"
                name="longitudine"
                value={formData.longitudine}
                onChange={handleInputChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specializări
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {specializations.map((spec) => (
                    <div key={spec.id_specializare} className="flex items-center">
                      <input
                        id={`spec-${spec.id_specializare}`}
                        type="checkbox"
                        value={spec.id_specializare}
                        checked={formData.specializari.includes(spec.id_specializare)}
                        onChange={handleSpecializationsChange}
                        className="mr-2"
                      />
                      <label htmlFor={`spec-${spec.id_specializare}`}>{spec.nume_specializare}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Textarea
              label="Descriere"
              id="descriere"
              name="descriere"
              value={formData.descriere}
              onChange={handleInputChange}
              rows={4}
            />
            <div className="flex justify-end mt-4 space-x-2">
              {editingHospital && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Anulează
                </Button>
              )}
              <Button type="submit">{editingHospital ? "Actualizează" : "Adaugă"}</Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      <Card className="mb-6">
        <Card.Body>
          <h2 className="text-xl font-semibold mb-4">Filtrează spitale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={resetFilters} className="mr-2">
              Resetează filtre
            </Button>
            <Button onClick={applyFilters}>Aplică filtre</Button>
          </div>
        </Card.Body>
      </Card>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Nume</th>
              <th className="py-3 px-4 text-left">Locație</th>
              <th className="py-3 px-4 text-left">Grad accesibilitate</th>
              <th className="py-3 px-4 text-left">Specializări</th>
              <th className="py-3 px-4 text-left">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital.id_spital} className="border-t border-gray-200">
                <td className="py-3 px-4">{hospital.id_spital}</td>
                <td className="py-3 px-4">
                  <Link to={`/hospitals/${hospital.id_spital}`} className="text-primary-600 hover:underline">
                    {hospital.nume}
                  </Link>
                </td>
                <td className="py-3 px-4">{hospital.locatie}</td>
                <td className="py-3 px-4 capitalize">{hospital.grad_accesibilitate || "Nespecificat"}</td>
                <td className="py-3 px-4">
                  {hospital.specializari && hospital.specializari.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {hospital.specializari.map((spec) => (
                        <span
                          key={spec.id_specializare}
                          className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded"
                        >
                          {spec.nume_specializare}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Fără specializări"
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                     <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditHospital(hospital)}
                    >
                      Editează
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteHospital(hospital.id_spital, hospital.nume)}
                    >
                      Șterge
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hospitals.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
          <p className="text-lg text-gray-600">Nu s-au găsit spitale care să corespundă criteriilor de filtrare.</p>
        </div>
      )}
    </div>
  )
}

export default HospitalsPage

"use client"

import { useState, useEffect } from "react"
import Card from "../../components/Card"
import Button from "../../components/Button"
import Alert from "../../components/Alert"
import Input from "../../components/Input"
import Select from "../../components/Select"
import api from "../../services/api"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    nume: "",
    email: "",
    rol: "basic",
    stare_cont: "activ",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/users/getAll")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("A apărut o eroare la încărcarea utilizatorilor.")
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

  const handleEditUser = (user) => {
    setEditingUser(user)
    setFormData({
      nume: user.nume,
      email: user.email,
      rol: user.rol,
      stare_cont: user.stare_cont,
    })
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setFormData({
      nume: "",
      email: "",
      rol: "basic",
      stare_cont: "activ",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await api.put(`/users/update/${editingUser.id_utilizator}`, formData)
        setSuccess(`Utilizatorul ${formData.nume} a fost actualizat cu succes.`)
      } else {
        await api.post("/users/create", formData)
        setSuccess(`Utilizatorul ${formData.nume} a fost creat cu succes.`)
      }
      fetchUsers()
      handleCancelEdit()
    } catch (error) {
      console.error("Error saving user:", error)
      setError(error.response?.data?.error || "A apărut o eroare la salvarea utilizatorului.")
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Sigur doriți să ștergeți utilizatorul ${userName}?`)) {
      return
    }

    try {
      await api.delete(`/users/delete/${userId}`)
      setSuccess(`Utilizatorul ${userName} a fost șters cu succes.`)
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      setError(error.response?.data?.error || "A apărut o eroare la ștergerea utilizatorului.")
    }
  }

  if (loading && users.length === 0) {
    return <div className="text-center py-8">Se încarcă utilizatorii...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionare utilizatori</h1>

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
          <h2 className="text-xl font-semibold">{editingUser ? "Editare utilizator" : "Adaugă utilizator nou"}</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nume" id="nume" name="nume" value={formData.nume} onChange={handleInputChange} required />

              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={editingUser}
              />

              <Select
                label="Rol"
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                options={[
                  { value: "basic", label: "Basic" },
                  { value: "premium", label: "Premium" },
                  { value: "admin", label: "Admin" },
                ]}
              />

              <Select
                label="Stare cont"
                id="stare_cont"
                name="stare_cont"
                value={formData.stare_cont}
                onChange={handleInputChange}
                options={[
                  { value: "activ", label: "Activ" },
                  { value: "inactiv", label: "Inactiv" },
                  { value: "suspendat", label: "Suspendat" },
                ]}
              />
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              {editingUser && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Anulează
                </Button>
              )}
              <Button type="submit">{editingUser ? "Actualizează" : "Adaugă"}</Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Lista utilizatorilor</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Nume</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rol</th>
              <th className="py-3 px-4 text-left">Stare cont</th>
              <th className="py-3 px-4 text-left">Data înregistrării</th>
              <th className="py-3 px-4 text-left">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_utilizator} className="border-t border-gray-200">
                <td className="py-3 px-4">{user.id_utilizator}</td>
                <td className="py-3 px-4">{user.nume}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4 capitalize">{user.rol}</td>
                <td className="py-3 px-4 capitalize">{user.stare_cont}</td>
                <td className="py-3 px-4">{new Date(user.data_inregistrare).toLocaleDateString("ro-RO")}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                      Editează
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id_utilizator, user.nume)}>
                      Șterge
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersPage

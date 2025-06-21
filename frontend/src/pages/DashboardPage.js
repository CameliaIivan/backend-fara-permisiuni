"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  getUserGroups,
  getPosts,
  createPost,
} from "../services/socialService"
import Card from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import Textarea from "../components/Textarea"
import Select from "../components/Select"
import Alert from "../components/Alert"
import { FaHospital, FaBook, FaUsers, FaCalendarAlt } from "react-icons/fa"

function DashboardPage() {
  const { currentUser } = useAuth()
  const [groups, setGroups] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newPost, setNewPost] = useState({ titlu: "", continut: "", id_grup: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true)
        const memberships = await getUserGroups(currentUser.id)
        const groupOptions = memberships.map((m) => ({
          value: m.id_grup,
          label: m.grup.nume,
        }))
        setGroups(groupOptions)
        const groupIds = memberships.map((m) => m.id_grup)
        const allPosts = await getPosts()
        const filtered = allPosts.filter((p) => groupIds.includes(p.id_grup))
        filtered.sort((a, b) => new Date(b.data_postarii) - new Date(a.data_postarii))
        setPosts(filtered)
      } catch (e) {
        console.error("Error fetching feed:", e)
        setError("A apărut o eroare la încărcarea feed-ului. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }
    if (currentUser) {
      fetchFeed()
    }
  }, [currentUser])

  const handlePostChange = (e) => {
    const { name, value } = e.target
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault()
    if (!newPost.titlu || !newPost.continut || !newPost.id_grup) return

    try {
      setIsSubmitting(true)
      const data = await createPost({
        titlu: newPost.titlu,
        continut: newPost.continut,
        tip: "text",
        id_grup: Number.parseInt(newPost.id_grup),
      })
      setPosts((prev) => [data, ...prev])
      setNewPost({ titlu: "", continut: "", id_grup: "" })
    } catch (err) {
      console.error("Error creating post:", err)
      setError("A apărut o eroare la creare. Vă rugăm încercați din nou.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Ce oferim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <Card.Body>
              <div className="flex justify-center mb-4">
                <FaBook className="text-5xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Informații legislative</h3>
              <p className="text-gray-600 mb-4">
                Acces la articole și informații legislative relevante pentru persoanele cu dizabilități.
              </p>
              <Link to="/articles">
                <Button variant="outline" className="w-full">
                  Explorează articole
                </Button>
              </Link>
            </Card.Body>
          </Card>

          <Card className="text-center">
            <Card.Body>
              <div className="flex justify-center mb-4">
                <FaHospital className="text-5xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Hartă spitale</h3>
              <p className="text-gray-600 mb-4">
                Găsește spitale, clinici și sanatorii adaptate nevoilor tale specifice.
              </p>
              <Link to="/hospitals">
                <Button variant="outline" className="w-full">
                  Caută spitale
                </Button>
              </Link>
            </Card.Body>
          </Card>

          <Card className="text-center">
            <Card.Body>
              <div className="flex justify-center mb-4">
                <FaUsers className="text-5xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comunitate</h3>
              <p className="text-gray-600 mb-4">
                Conectează-te cu alți membri, împărtășește experiențe și găsește sprijin.
              </p>
              <Link to="/groups">
                <Button variant="outline" className="w-full">
                  Alătură-te grupurilor
                </Button>
              </Link>
            </Card.Body>
          </Card>

          <Card className="text-center">
            <Card.Body>
              <div className="flex justify-center mb-4">
                <FaCalendarAlt className="text-5xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Evenimente</h3>
              <p className="text-gray-600 mb-4">Participă la evenimente și activități organizate pentru comunitate.</p>
              <Link to="/events">
                <Button variant="outline" className="w-full">
                  Vezi evenimente
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </section>

      {/* Feed Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Feed-ul meu</h2>
        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}
        {groups.length > 0 && (
          <Card className="mb-6">
            <Card.Header>
              <h3 className="text-xl font-semibold">Creează o postare</h3>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmitPost}>
                <Select
                  label="Grup"
                  id="id_grup"
                  name="id_grup"
                  value={newPost.id_grup}
                  onChange={handlePostChange}
                  options={[{ value: "", label: "Alege grupul" }, ...groups]}
                  required
                />
                <Input
                  label="Titlu"
                  id="titlu"
                  name="titlu"
                  value={newPost.titlu}
                  onChange={handlePostChange}
                  required
                />
                <Textarea
                  label="Conținut"
                  id="continut"
                  name="continut"
                  rows={4}
                  value={newPost.continut}
                  onChange={handlePostChange}
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Se postează..." : "Postează"}
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-8">Se încarcă feed-ul...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600">Nu există postări în grupurile tale.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id_postare}>
                <Card.Body>
                  <h3 className="text-xl font-bold mb-2">{post.titlu}</h3>
                  <p className="text-gray-600 mb-4">{post.continut}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                      <p>
                        Postat de: <span className="font-medium">{post.utilizator?.nume || "Utilizator necunoscut"}</span>
                      </p>
                      <p>{new Date(post.data_postarii).toLocaleDateString("ro-RO")}</p>
                    </div>
                    <p>{post.grup?.nume}</p>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
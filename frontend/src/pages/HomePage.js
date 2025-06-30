"use client"
import { useState, useEffect } from "react"
import { Link , useNavigate} from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/Button"
import Card from "../components/Card"
import { FaHospital, FaBook, FaUsers, FaCalendarAlt } from "react-icons/fa"
import Input from "../components/Input"
import Textarea from "../components/Textarea"
import Select from "../components/Select"
import Alert from "../components/Alert" 
import MyPostsPage from "./MyPostsPage"
import { createPost, getUserGroups } from "../services/socialService"

function HomePage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [groups, setGroups] = useState([])
  const [postData, setPostData] = useState({ groupId: "", titlu: "", continut: "" })
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchGroups = async () => {
      if (!currentUser) return
      try {
        const data = await getUserGroups(currentUser.id)
        const mapped = data.map((item) => item.Grup || item.grup)
        setGroups(mapped)
      } catch (err) {
        console.error("Error fetching user groups", err)
      }
    }

    fetchGroups()
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setPostData((prev) => ({ ...prev, [name]: value }))
  }
  const handleLogout = () => {
    logout()
    navigate("/")
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!postData.groupId || !postData.titlu || !postData.continut) return
    try {
      setIsSubmitting(true)
      setSubmitError("")
      await createPost({
        titlu: postData.titlu,
        continut: postData.continut,
        id_grup: Number(postData.groupId),
      })
      setPostData({ groupId: "", titlu: "", continut: "" })
    } catch (err) {
      console.error("Error creating post", err)
      setSubmitError("A apărut o eroare la crearea postării.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16 rounded-lg mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Platformă de accesibilitate pentru toți</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Informații, resurse și o comunitate dedicată persoanelor cu dizabilități
          </p>
          {!currentUser ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg">Înregistrează-te</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="bg-white">
                  Autentifică-te
                </Button>
              </Link>
            </div>
            ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <p className="text-xl mb-4">Bine ai venit, {currentUser.nume}!</p>
              <Button onClick={handleLogout} variant="outline" size="lg" className="bg-white">
                Deconectează-te
              </Button>
            </div>
          )}
        </div>
      </section>

      {currentUser && groups.length > 0 && (
        <section className="mb-12">
          <Card className="max-w-xl mx-auto">
            <Card.Header>
              <h2 className="text-xl font-semibold">Postează în grup</h2>
            </Card.Header>
            <Card.Body>
              {submitError && (
                <Alert type="error" className="mb-4">
                  {submitError}
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <Select
                  label="Grup"
                  id="groupId"
                  name="groupId"
                  value={postData.groupId}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Selectează grupul" },
                    ...groups.map((g) => ({ value: g.id_grup, label: g.nume })),
                  ]}
                  required
                />
                <Input
                  label="Titlu"
                  id="titlu"
                  name="titlu"
                  value={postData.titlu}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  label="Conținut"
                  id="continut"
                  name="continut"
                  value={postData.continut}
                  onChange={handleChange}
                  rows={4}
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
        </section>
      )}
     {currentUser && <MyPostsPage />}

      
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

      {/* Call to Action */}
      <section className="bg-gray-100 rounded-lg p-8 text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ai întrebări?</h2>
        <p className="text-xl mb-6">Consultă secțiunea noastră de întrebări frecvente sau contactează-ne direct.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/faq">
            <Button>Vezi FAQ</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Contactează-ne</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage

"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getPosts, getUserGroups, createPost } from "../services/socialService"
import { useAuth } from "../contexts/AuthContext"
import Card from "../components/Card"
import Button from "../components/Button"
import Alert from "../components/Alert"
import Input from "../components/Input"
import Textarea from "../components/Textarea"
import Select from "../components/Select"

function MyPostsPage() {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [groups, setGroups] = useState([])
  const [newPost, setNewPost] = useState({ titlu: "", continut: "", id_grup: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getPosts({ creat_de: currentUser.id })
        setPosts(data)
        const [postsData, groupsData] = await Promise.all([
          getPosts({ creat_de: currentUser.id }),
          getUserGroups(currentUser.id),
        ])
        setPosts(postsData)
        const mappedGroups = groupsData.map((g) => g.Grup || g.grup)
        setGroups(mappedGroups.map((g) => ({ value: g.id_grup, label: g.nume })))
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError("A apărut o eroare la încărcarea postărilor.")
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchData()
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
        id_grup: Number.parseInt(newPost.id_grup),
      })
      setPosts((prev) => [data, ...prev])
      setNewPost({ titlu: "", continut: "", id_grup: "" })
    } catch (err) {
      console.error("Error creating post:", err)
      setError("A apărut o eroare la crearea postării.")
    } finally {
      setIsSubmitting(false)
    }
  }
  if (loading) {
    return <div className="text-center py-8">Se încarcă postările...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Postările mele</h1>

      {error && (
        <Alert type="error" className="mb-6">
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
      {posts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">Nu ai creat încă nicio postare.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id_postare}>
              <Card.Body>
                <h2 className="text-xl font-bold mb-2">{post.titlu}</h2>
                <p className="text-gray-600 mb-4">{post.continut}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    {(post.Grup || post.grup) && (
                      <p>
                        Grup: <span className="font-medium">{(post.Grup || post.grup).nume}</span>
                      </p>
                    )}
                    <p>{new Date(post.data_postarii).toLocaleDateString("ro-RO")}</p>
                    <p>
                      Like-uri: {post.numar_like} | Comentarii: {post.numar_comentarii}
                    </p>
                  </div>
                  <Link to={`/posts/${post.id_postare}`}>
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

export default MyPostsPage
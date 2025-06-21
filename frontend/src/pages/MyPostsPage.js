"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getPosts } from "../services/socialService"
import { useAuth } from "../contexts/AuthContext"
import Card from "../components/Card"
import Button from "../components/Button"
import Alert from "../components/Alert"

function MyPostsPage() {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const data = await getPosts({ creat_de: currentUser.id })
        setPosts(data)
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError("A apărut o eroare la încărcarea postărilor.")
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchPosts()
    }
  }, [currentUser])

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
                    {post.grup && (
                      <p>
                        Grup: <span className="font-medium">{post.grup.nume}</span>
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
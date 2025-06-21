// "use client"

// import { useState, useEffect } from "react"
// import { useParams, Link } from "react-router-dom"
// import { getGroupById, createPost, joinGroup } from "../services/socialService"
// import Card from "../components/Card"
// import Button from "../components/Button"
// import Input from "../components/Input"
// import Textarea from "../components/Textarea"
// import Alert from "../components/Alert"
// import { useAuth } from "../contexts/AuthContext"

// function GroupDetailPage() {
//   const { id } = useParams()
//   const [group, setGroup] = useState(null)
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [newPost, setNewPost] = useState({ titlu: "", continut: "" })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const { currentUser } = useAuth()

//   useEffect(() => {
//     const fetchGroupData = async () => {
//       try {
//         setLoading(true)
//         const groupData = await getGroupById(id)
//         setGroup(groupData.grup)
//         setPosts(groupData.postari || [])
//       } catch (error) {
//         console.error("Error fetching group data:", error)
//         setError("A apărut o eroare la încărcarea datelor grupului. Vă rugăm încercați din nou.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchGroupData()
//   }, [id])

//   const handlePostChange = (e) => {
//     const { name, value } = e.target
//     setNewPost((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleSubmitPost = async (e) => {
//     e.preventDefault()
//     if (!newPost.titlu || !newPost.continut) {
//       return
//     }

//     try {
//       setIsSubmitting(true)
//       const postData = {
//         titlu: newPost.titlu,
//         continut: newPost.continut,
//         tip: "text",
//         id_grup: Number.parseInt(id),
//       }

//       const createdPost = await createPost(postData)
//       setPosts((prev) => [createdPost, ...prev])
//       setNewPost({ titlu: "", continut: "" })
//     } catch (error) {
//       console.error("Error creating post:", error)
//       setError("A apărut o eroare la crearea postării. Vă rugăm încercați din nou.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }
//   const handleJoinGroup = async () => {
//     try {
//       const numericId = Number.parseInt(id)
//       if (isNaN(numericId)) {
//       throw new Error("ID-ul grupului este invalid")
//       }

//       await joinGroup(numericId)
//       const groupData = await getGroupById(id)
//       setGroup(groupData.grup)
//       setPosts(groupData.postari || [])
//       // await joinGroup(id_grup)
//       // setSuccess("Te-ai alăturat grupului!")
//       // fetchData()
//     } catch (error) {
//       console.error("Error joining group:", error)
//       const errorMsg = err.response?.data?.error || "A apărut o eroare. Vă rugăm încercați din nou."
//       setError(errorMsg)
//     }
//   }
//   if (loading) {
//     return <div className="text-center py-8">Se încarcă datele grupului...</div>
//   }

//   if (error) {
//     return (
//       <Alert type="error" className="my-8">
//         {error}
//       </Alert>
//     )
//   }

//   if (!group) {
//     return (
//       <div className="text-center py-8">
//         <h2 className="text-2xl font-bold mb-4">Grupul nu a fost găsit</h2>
//         <Link to="/groups">
//           <Button>Înapoi la grupuri</Button>
//         </Link>
//       </div>
//     )
//   }

//   const isMember = currentUser && group.membri && group.membri.some((m) => m.id_utilizator === currentUser.id)

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <Link to="/groups">
//           <Button variant="outline">&larr; Înapoi la grupuri</Button>
//         </Link>
//       </div>

//       <Card className="mb-8">
//         <Card.Body>
//           <h1 className="text-3xl font-bold mb-2">{group.nume}</h1>
//           {group.este_privata && (
//             <div className="inline-block bg-secondary-100 text-secondary-800 text-sm px-2 py-1 rounded mb-4">
//               Grup privat
//             </div>
//           )}
//           <p className="text-gray-600 mb-6">{group.descriere}</p>

//           <div className="flex justify-between items-center">
//             <div className="text-sm text-gray-500">
//               <p>
//                 Creat de: <span className="font-medium">{group.creator?.nume || "Utilizator necunoscut"}</span>
//               </p>
//               <p>Data creării: {new Date(group.data_crearii).toLocaleDateString("ro-RO")}</p>
//             </div>
//             {currentUser && !isMember && (
//               <Button onClick={handleJoinGroup}>Alătură-te grupului</Button>
//             )}
//           </div>
//         </Card.Body>
//       </Card>

//       {currentUser && isMember && (
//         <Card className="mb-8">
//           <Card.Header>
//             <h2 className="text-xl font-semibold">Creează o postare nouă</h2>
//           </Card.Header>
//           <Card.Body>
//             <form onSubmit={handleSubmitPost}>
//               <Input label="Titlu" id="titlu" name="titlu" value={newPost.titlu} onChange={handlePostChange} required />
//               <Textarea
//                 label="Conținut"
//                 id="continut"
//                 name="continut"
//                 value={newPost.continut}
//                 onChange={handlePostChange}
//                 required
//                 rows={4}
//               />
//               <div className="flex justify-end">
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? "Se postează..." : "Postează"}
//                 </Button>
//               </div>
//             </form>
//           </Card.Body>
//         </Card>
//       )}

//       <h2 className="text-2xl font-semibold mb-4">Postări recente</h2>
//       {posts.length === 0 ? (
//         <div className="text-center py-8 bg-gray-50 rounded-lg">
//           <p className="text-lg text-gray-600">Nu există postări în acest grup.</p>
//           {currentUser && isMember && <p className="text-gray-500">Fii primul care postează ceva!</p>}
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {posts.map((post) => (
//             <Card key={post.id_postare}>
//               <Card.Body>
//                 <h3 className="text-xl font-bold mb-2">{post.titlu}</h3>
//                 <p className="text-gray-600 mb-4">{post.continut}</p>
//                 <div className="flex justify-between items-center text-sm text-gray-500">
//                   <div>
//                     <p>
//                       Postat de: <span className="font-medium">{post.utilizator?.nume || "Utilizator necunoscut"}</span>
//                     </p>
//                     <p>{new Date(post.data_postarii).toLocaleDateString("ro-RO")}</p>
//                   </div>
//                   <Link to={`/posts/${post.id_postare}`}>
//                     <Button variant="outline" size="sm">
//                       Vezi detalii
//                     </Button>
//                   </Link>
//                 </div>
//               </Card.Body>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default GroupDetailPage
"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getGroupById, createPost, joinGroup } from "../services/socialService"
import Card from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import Textarea from "../components/Textarea"
import Alert from "../components/Alert"
import { useAuth } from "../contexts/AuthContext"

function GroupDetailPage() {
  const { id } = useParams()
  const id_grup = Number(id)
  const { currentUser } = useAuth()

  const [group, setGroup] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [newPost, setNewPost] = useState({ titlu: "", continut: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch group details and posts
  const fetchGroupData = async () => {
    setError("")
    try {
      setLoading(true)
      const { grup, postari } = await getGroupById(id_grup)
      setGroup(grup)
      setPosts(postari || [])
    } catch (err) {
      console.error("Error fetching group data:", err)
      setError("A apărut o eroare la încărcarea datelor grupului. Vă rugăm încercați din nou.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroupData()
  }, [id_grup])

  // Handle new post submission
  const handlePostChange = e => {
    const { name, value } = e.target
    setNewPost(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitPost = async e => {
    e.preventDefault()
    if (!newPost.titlu || !newPost.continut) return
    setError("")
    setSuccess("")
    try {
      setIsSubmitting(true)
      const created = await createPost({ ...newPost, tip: "text", id_grup })
      setPosts(prev => [created, ...prev])
      setNewPost({ titlu: "", continut: "" })
      setSuccess("Postarea a fost creată cu succes.")
    } catch (err) {
      console.error("Error creating post:", err)
      setError(err.response?.data?.error || "A apărut o eroare la crearea postării. Vă rugăm încercați din nou.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle joining group
  const handleJoinGroup = async () => {
    setError("")
    setSuccess("")
    try {
      await joinGroup(id_grup)
      setSuccess("Te-ai alăturat grupului!")
      fetchGroupData()
    } catch (err) {
      console.error("Error joining group:", err)
      setError(err.response?.data?.error || "A apărut o eroare la alăturarea grupului. Vă rugăm încercați din nou.")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Se încarcă datele grupului...</div>
  }

  return (
    <div>
      {error && <Alert type="error" className="my-4">{error}</Alert>}
      {success && <Alert type="success" className="my-4">{success}</Alert>}

      {!group ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Grupul nu a fost găsit</h2>
          <Link to="/groups"><Button>Înapoi la grupuri</Button></Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <Link to="/groups"><Button variant="outline">&larr; Înapoi la grupuri</Button></Link>
          </div>

          <Card className="mb-8">
            <Card.Body>
              <h1 className="text-3xl font-bold mb-2">{group.nume}</h1>
              {group.este_privata && <span className="inline-block bg-secondary-100 text-secondary-800 text-sm px-2 py-1 rounded mb-4">Grup privat</span>}
              <p className="text-gray-600 mb-6">{group.descriere}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p>Creat de: <span className="font-medium">{group.creator?.nume}</span></p>
                  <p>Data creării: {new Date(group.data_crearii).toLocaleDateString("ro-RO")}</p>
                </div>
                {!group.membri?.some(m => m.id_utilizator === currentUser?.id) && (
                  <Button onClick={handleJoinGroup}>Alătură-te grupului</Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {group.membri?.some(m => m.id_utilizator === currentUser?.id) && (
            <Card className="mb-8">
              <Card.Header><h2 className="text-xl font-semibold">Creează o postare nouă</h2></Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmitPost}>
                  <Input label="Titlu" name="titlu" value={newPost.titlu} onChange={handlePostChange} required />
                  <Textarea label="Conținut" name="continut" value={newPost.continut} onChange={handlePostChange} required rows={4} />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Se postează..." : "Postează"}</Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          )}

          <h2 className="text-2xl font-semibold mb-4">Postări recente</h2>
          {posts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-600">Nu există postări în acest grup.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <Card key={post.id_postare} className="mb-4">
                  <Card.Body>
                    <h3 className="text-xl font-bold mb-2">{post.titlu}</h3>
                    <p className="text-gray-600 mb-4">{post.continut}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div>
                        <p>Postat de: <span className="font-medium">{post.utilizator?.nume}</span></p>
                        <p>{new Date(post.data_postarii).toLocaleDateString("ro-RO")}</p>
                      </div>
                      <Link to={`/posts/${post.id_postare}`}><Button variant="outline" size="sm">Vezi detalii</Button></Link>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GroupDetailPage

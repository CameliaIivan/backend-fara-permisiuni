// "use client"

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { getArticles, getArticleCategories, createArticle, updateArticle, deleteArticle } from "../../services/articleService"
// import Card from "../../components/Card"
// import Button from "../../components/Button"
// import Alert from "../../components/Alert"
// import Select from "../../components/Select"
// import Input from "../../components/Input"
// import Textarea from "../../components/Textarea"
// import { useAuth } from "../../contexts/AuthContext"

// function ArticlesPage() {
//   const [articles, setArticles] = useState([])
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [editingArticle, setEditingArticle] = useState(null)
//   const [formData, setFormData] = useState({
//     titlu: "",
//     continut: "",
//     id_categorie: "",
//   })
//   const [filters, setFilters] = useState({
//     id_categorie: "",
//     search: "",
//   })

//   const { isAdmin } = useAuth()

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       const [articlesData, categoriesData] = await Promise.all([getArticles(), getArticleCategories()])
//       setArticles(articlesData)
//       setCategories(categoriesData)
//     } catch (error) {
//       console.error("Error fetching data:", error)
//       setError("A apărut o eroare la încărcarea datelor.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleDeleteArticle = async (id, title) => {
//     if (!window.confirm(`Sigur doriți să ștergeți articolul "${title}"?`)) {
//       return
//     }

//     try {
//       await deleteArticle(id)
//       setSuccess(`Articolul "${title}" a fost șters cu succes.`)
//       fetchData()
//     } catch (error) {
//       console.error("Error deleting article:", error)
//       setError(error.response?.data?.error || "A apărut o eroare la ștergerea articolului.")
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleEditArticle = (article) => {
//     setEditingArticle(article)
//     setFormData({
//       titlu: article.titlu,
//       continut: article.continut,
//       id_categorie: article.id_categorie || "",
//     })
//   }

//   const handleCancelEdit = () => {
//     setEditingArticle(null)
//     setFormData({
//       titlu: "",
//       continut: "",
//       id_categorie: "",
//     })
//   }

//   const handleSubmit = async (e) => {
//   e.preventDefault()
//   setError("")
//   setSuccess("")

//   // construim payload-ul cu id_categorie numeric sau null
//   const payload = {
//     titlu: formData.titlu,
//     continut: formData.continut,
//     id_categorie: formData.id_categorie
//       ? Number(formData.id_categorie)
//       : null,
//   }

//   try {
//     if (editingArticle) {
//       await updateArticle(editingArticle.id_articol, payload)
//       setSuccess(`Articolul "${payload.titlu}" a fost actualizat cu succes.`)
//     } else {
//       await createArticle(payload)
//       setSuccess(`Articolul "${payload.titlu}" a fost creat cu succes.`)
//     }
//     await fetchData()
//     handleCancelEdit()
//   } catch (error) {
//     console.error("Error saving article:", error)
//     setError(error.response?.data?.error || "A apărut o eroare la salvarea articolului.")
//   }
// }

//   // Filter articles based on category and search term
//   const filteredArticles = articles.filter((article) => {
//     const matchesCategory = !filters.id_categorie || article.id_categorie === Number(filters.id_categorie)
//     const matchesSearch =
//       !filters.search ||
//       article.titlu.toLowerCase().includes(filters.search.toLowerCase()) ||
//       article.continut.toLowerCase().includes(filters.search.toLowerCase())
//     return matchesCategory && matchesSearch
//   })

//   if (loading && articles.length === 0) {
//     return <div className="text-center py-8">Se încarcă articolele...</div>
//   }

//   return (
//     <div>
//        <h1 className="text-3xl font-bold mb-6">Gestionare articole</h1>

//       {error && (
//         <Alert type="error" className="mb-6" dismissible onDismiss={() => setError("")}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert type="success" className="mb-6" dismissible onDismiss={() => setSuccess("")}>
//           {success}
//         </Alert>
//       )}

//        {isAdmin && (
//         <Card className="mb-8">
//           <Card.Header>
//             <h2 className="text-xl font-semibold">
//               {editingArticle ? "Editare articol" : "Adaugă articol nou"}
//             </h2>
//           </Card.Header>
//           <Card.Body>
//             <form onSubmit={handleSubmit}>
//               <Input
//                 label="Titlu"
//                 id="titlu"
//                 name="titlu"
//                 value={formData.titlu}
//                 onChange={handleInputChange}
//                 required
//               />
//               <Textarea
//                 label="Conținut"
//                 id="continut"
//                 name="continut"
//                 value={formData.continut}
//                 onChange={handleInputChange}
//                 rows={6}
//                 required
//               />
//               <Select
//                 label="Categorie"
//                 id="id_categorie"
//                 name="id_categorie"
//                 value={formData.id_categorie}
//                 onChange={handleInputChange}
//                 options={[
//                   { value: "", label: "Selectează categoria" },
//                   ...categories.map((cat) => ({ value: cat.id_categorie, label: cat.nume })),
//                 ]}
//                 required
//               />
//               <div className="flex justify-end mt-4 space-x-2">
//                 {editingArticle && (
//                   <Button type="button" variant="outline" onClick={handleCancelEdit}>
//                     Anulează
//                   </Button>
//                 )}
//                 <Button type="submit">{editingArticle ? "Actualizează" : "Adaugă"}</Button>
//               </div>
//             </form>
//           </Card.Body>
//         </Card>
//       )}



//       <Card className="mb-6">
//         <Card.Body>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Select
//               label="Filtrează după categorie"
//               id="id_categorie"
//               name="id_categorie"
//               value={filters.id_categorie}
//               onChange={handleFilterChange}
//               options={[
//                 { value: "", label: "Toate categoriile" },
//                 ...categories.map((cat) => ({ value: cat.id_categorie, label: cat.nume })),
//               ]}
//             />

//             <Input
//               label="Caută în articole"
//               id="search"
//               name="search"
//               value={filters.search}
//               onChange={handleFilterChange}
//               placeholder="Caută după titlu sau conținut..."
//             />
//           </div>
//         </Card.Body>
//       </Card>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left">ID</th>
//               <th className="py-3 px-4 text-left">Titlu</th>
//               <th className="py-3 px-4 text-left">Categorie</th>
//               <th className="py-3 px-4 text-left">Data creării</th>
//                {isAdmin && (
//                 <th className="py-3 px-4 text-left">Acțiuni</th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredArticles.map((article) => {
//               const category = categories.find((cat) => cat.id_categorie === article.id_categorie)
//               return (
//                 <tr key={article.id_articol} className="border-t border-gray-200">
//                   <td className="py-3 px-4">{article.id_articol}</td>
//                   <td className="py-3 px-4">
//                     <Link to={`/articles/${article.id_articol}`} className="text-primary-600 hover:underline">
//                       {article.titlu}
//                     </Link>
//                   </td>
//                   <td className="py-3 px-4">{category ? category.nume : "Fără categorie"}</td>
//                   <td className="py-3 px-4">{new Date(article.data_crearii).toLocaleDateString("ro-RO")}</td>
//                   {isAdmin && (
//                     <td className="py-3 px-4">
//                       <div className="flex space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleEditArticle(article)}
//                         >
//                           Editează
//                         </Button>
//                         <Button
//                           variant="danger"
//                           size="sm"
//                           onClick={() => handleDeleteArticle(article.id_articol, article.titlu)}
//                         >
//                           Șterge
//                         </Button>
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       {filteredArticles.length === 0 && (
//         <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
//           <p className="text-lg text-gray-600">Nu s-au găsit articole care să corespundă criteriilor de filtrare.</p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ArticlesPage
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  getArticles,
  getArticleCategories,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../services/articleService"
import Card from "../../components/Card"
import Button from "../../components/Button"
import Alert from "../../components/Alert"
import Select from "../../components/Select"
import Input from "../../components/Input"
import Textarea from "../../components/Textarea"
import { useAuth } from "../../contexts/AuthContext"

function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingArticle, setEditingArticle] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ titlu: "", continut: "", id_categorie: "" })
  const [filters, setFilters] = useState({ id_categorie: "", search: "" })

  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [articlesData, categoriesData] = await Promise.all([getArticles(), getArticleCategories()])
      setArticles(articlesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("A apărut o eroare la încărcarea datelor.")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleDeleteArticle = async (id, title) => {
    if (!window.confirm(`Sigur doriți să ștergeți articolul "${title}"?`)) return

    try {
      await deleteArticle(id)
      setSuccess(`Articolul "${title}" a fost șters cu succes.`)
      fetchData()
    } catch (error) {
      console.error("Error deleting article:", error)
      setError(error.response?.data?.error || "A apărut o eroare la ștergerea articolului.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditArticle = (article) => {
    setEditingArticle(article)
    setFormData({
      titlu: article.titlu,
      continut: article.continut,
      id_categorie: article.id_categorie || "",
    })
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingArticle(null)
    setFormData({ titlu: "", continut: "", id_categorie: "" })
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const payload = {
      titlu: formData.titlu,
      continut: formData.continut,
      id_categorie: formData.id_categorie ? Number(formData.id_categorie) : null,
    }

    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id_articol, payload)
        setSuccess(`Articolul "${payload.titlu}" a fost actualizat cu succes.`)
      } else {
        await createArticle(payload)
        setSuccess(`Articolul "${payload.titlu}" a fost creat cu succes.`)
      }
      await fetchData()
      handleCancelEdit()
    } catch (error) {
      console.error("Error saving article:", error)
      setError(error.response?.data?.error || "A apărut o eroare la salvarea articolului.")
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = !filters.id_categorie || article.id_categorie === Number(filters.id_categorie)
    const matchesSearch =
      !filters.search ||
      article.titlu.toLowerCase().includes(filters.search.toLowerCase()) ||
      article.continut.toLowerCase().includes(filters.search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading && articles.length === 0) return <div className="text-center py-8">Se încarcă articolele...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionare articole</h1>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Anulează" : "Adaugă articol"}
          </Button>
        )}
      </div>

      {error && <Alert type="error" className="mb-6" dismissible onDismiss={() => setError("")}>{error}</Alert>}
      {success && <Alert type="success" className="mb-6" dismissible onDismiss={() => setSuccess("")}>{success}</Alert>}

      {isAdmin && showForm && (
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-xl font-semibold">
              {editingArticle ? "Editare articol" : "Adaugă articol nou"}
            </h2>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Input label="Titlu" id="titlu" name="titlu" value={formData.titlu} onChange={handleInputChange} required />
              <Textarea label="Conținut" id="continut" name="continut" value={formData.continut} onChange={handleInputChange} rows={6} required />
              <Select
                label="Categorie"
                id="id_categorie"
                name="id_categorie"
                value={formData.id_categorie}
                onChange={handleInputChange}
                options={[{ value: "", label: "Selectează categoria" }, ...categories.map((cat) => ({ value: cat.id_categorie, label: cat.nume }))]}
                required
              />
              <div className="flex justify-end mt-4 space-x-2">
                {editingArticle && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>Anulează</Button>
                )}
                <Button type="submit">{editingArticle ? "Actualizează" : "Adaugă"}</Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      )}

      <Card className="mb-6">
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Filtrează după categorie"
              id="id_categorie"
              name="id_categorie"
              value={filters.id_categorie}
              onChange={handleFilterChange}
              options={[{ value: "", label: "Toate categoriile" }, ...categories.map((cat) => ({ value: cat.id_categorie, label: cat.nume }))]}
            />
            <Input
              label="Caută în articole"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Caută după titlu sau conținut..."
            />
          </div>
        </Card.Body>
      </Card>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Titlu</th>
              <th className="py-3 px-4 text-left">Categorie</th>
              <th className="py-3 px-4 text-left">Data creării</th>
              {isAdmin && <th className="py-3 px-4 text-left">Acțiuni</th>}
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => {
              const category = categories.find((cat) => cat.id_categorie === article.id_categorie)
              return (
                <tr key={article.id_articol} className="border-t border-gray-200">
                  <td className="py-3 px-4">{article.id_articol}</td>
                  <td className="py-3 px-4">
                    <Link to={`/articles/${article.id_articol}`} className="text-primary-600 hover:underline">
                      {article.titlu}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{category ? category.nume : "Fără categorie"}</td>
                  <td className="py-3 px-4">{new Date(article.data_crearii).toLocaleDateString("ro-RO")}</td>
                  {isAdmin && (
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditArticle(article)}>Editează</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteArticle(article.id_articol, article.titlu)}>Șterge</Button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
          <p className="text-lg text-gray-600">Nu s-au găsit articole care să corespundă criteriilor de filtrare.</p>
        </div>
      )}
    </div>
  )
}

export default ArticlesPage
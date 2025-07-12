// "use client"

// import { useState, useEffect } from "react"
// import Card from "../../components/Card"
// import Button from "../../components/Button"
// import Alert from "../../components/Alert"
// import api from "../../services/api"

// function StatisticsPage() {
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [stats, setStats] = useState({ admin: 0, premium: 0, basic: 0 })

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const fetchUsers = async () => {
//     try {
//       setLoading(true)
//       const res = await api.get("/users/getAll")
//       setUsers(res.data)
//       const counts = { admin: 0, premium: 0, basic: 0 }
//       res.data.forEach((u) => {
//         counts[u.rol] = (counts[u.rol] || 0) + 1
//       })
//       setStats(counts)
//     } catch (e) {
//       console.error("Error fetching users:", e)
//       setError("A apărut o eroare la încărcarea utilizatorilor.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const updateRole = async (user, role) => {
//     if (!window.confirm(`Schimbați rolul utilizatorului ${user.nume} în ${role}?`)) return

//     try {
//       await api.patch(`/users/${user.id_utilizator}/role`, { rol: role })
//       setSuccess(`Rolul utilizatorului ${user.nume} a fost actualizat.`)
//       fetchUsers()
//     } catch (e) {
//       console.error("Error updating role:", e)
//       setError(e.response?.data?.error || "A apărut o eroare la actualizarea rolului.")
//     }
//   }

//   if (loading && users.length === 0) {
//     return <div className="text-center py-8">Se încarcă statisticile...</div>
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Statistici utilizatori</h1>

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

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <Card>
//           <Card.Body>
//             <h2 className="text-xl font-semibold mb-2">Administratori</h2>
//             <p className="text-3xl font-bold text-center">{stats.admin}</p>
//           </Card.Body>
//         </Card>
//         <Card>
//           <Card.Body>
//             <h2 className="text-xl font-semibold mb-2">Utilizatori Premium</h2>
//             <p className="text-3xl font-bold text-center">{stats.premium}</p>
//           </Card.Body>
//         </Card>
//         <Card>
//           <Card.Body>
//             <h2 className="text-xl font-semibold mb-2">Utilizatori Basic</h2>
//             <p className="text-3xl font-bold text-center">{stats.basic}</p>
//           </Card.Body>
//         </Card>
//       </div>
//       <div className="mb-8">
//   <h2 className="text-2xl font-semibold mb-4">Diagrame</h2>
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     <figure>
//       <img
//         src="/diagrams/Picture4.png"
//         alt="Niveluri de mărire a textului"
//         className="w-full h-auto rounded-md"
//       />
//       <figcaption className="text-sm text-center mt-2">
//         O parte a publicului mărește textul peste 150%, deci interfața
//         trebuie să suporte mărirea.
//       </figcaption>
//     </figure>
//     <figure>
//       <img
//         src="/diagrams/Picture3.png"
//         alt="Preferințe notificări"
//         className="w-full h-auto rounded-md"
//       />
//       <figcaption className="text-sm text-center mt-2">
//         Mulți utilizatori preferă emailul sau SMS-ul pentru notificări,
//         iar unii nu doresc deloc.
//       </figcaption>
//     </figure>
//     <figure>
//       <img
//         src="/diagrams/Picture2.png"
//         alt="Tehnologii asistive utilizate"
//         className="w-full h-auto rounded-md"
//       />
//       <figcaption className="text-sm text-center mt-2">
//         Navigarea cu tastatura este cea mai folosită tehnologie asistivă.
//       </figcaption>
//     </figure>
//     <figure>
//       <img
//         src="/diagrams/Picture1.png"
//         alt="Distribuția tipurilor de dizabilități"
//         className="w-full h-auto rounded-md"
//       />
//       <figcaption className="text-sm text-center mt-2">
//         Majoritatea participanților au raportat dizabilități motorii, urmate
//         de cazuri cognitive.
//       </figcaption>
//     </figure>
//     <figure>
//       <img
//         src="/diagrams/image1.png"
//         alt="Corelații între probleme"
//         className="w-full h-auto rounded-md"
//       />
//       <figcaption className="text-sm text-center mt-2">
//         Problemele multimedia și cele de interacțiune apar adesea împreună,
//         în timp ce designul vizual este perceput separat.
//       </figcaption>
//     </figure>
//   </div>
// </div>

//       <h2 className="text-2xl font-semibold mb-4">Lista utilizatorilor</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left">ID</th>
//               <th className="py-3 px-4 text-left">Nume</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-left">Rol</th>
//               <th className="py-3 px-4 text-left">Acțiuni</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id_utilizator} className="border-t border-gray-200">
//                 <td className="py-3 px-4">{user.id_utilizator}</td>
//                 <td className="py-3 px-4">{user.nume}</td>
//                 <td className="py-3 px-4">{user.email}</td>
//                 <td className="py-3 px-4 capitalize">{user.rol}</td>
//                 <td className="py-3 px-4 space-x-2">
//                   {user.rol === "basic" ? (
//                     <>
//                       <Button size="sm" onClick={() => updateRole(user, "premium")}>Premium</Button>
//                       <Button size="sm" onClick={() => updateRole(user, "admin")}>Admin</Button>
//                     </>
//                   ) : (
//                     <span className="text-gray-500">-</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default StatisticsPage
"use client"

import { useState, useEffect } from "react"
import Card from "../../components/Card"
import Button from "../../components/Button"
import Alert from "../../components/Alert"
import api from "../../services/api"

function StatisticsPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [stats, setStats] = useState({ admin: 0, premium: 0, basic: 0 })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get("/users/getAll")
      setUsers(res.data)
      const counts = { admin: 0, premium: 0, basic: 0 }
      res.data.forEach((u) => {
        counts[u.rol] = (counts[u.rol] || 0) + 1
      })
      setStats(counts)
    } catch (e) {
      console.error("Error fetching users:", e)
      setError("A apărut o eroare la încărcarea utilizatorilor.")
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (user, role) => {
    if (!window.confirm(`Schimbați rolul utilizatorului ${user.nume} în ${role}?`)) return

    try {
      await api.patch(`/users/${user.id_utilizator}/role`, { rol: role })
      setSuccess(`Rolul utilizatorului ${user.nume} a fost actualizat.`)
      fetchUsers()
    } catch (e) {
      console.error("Error updating role:", e)
      setError(e.response?.data?.error || "A apărut o eroare la actualizarea rolului.")
    }
  }

  if (loading && users.length === 0) {
    return <div className="text-center py-8">Se încarcă statisticile...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Statistici utilizatori</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <Card.Body>
            <h2 className="text-xl font-semibold mb-2">Administratori</h2>
            <p className="text-3xl font-bold text-center">{stats.admin}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <h2 className="text-xl font-semibold mb-2">Utilizatori Premium</h2>
            <p className="text-3xl font-bold text-center">{stats.premium}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <h2 className="text-xl font-semibold mb-2">Utilizatori Basic</h2>
            <p className="text-3xl font-bold text-center">{stats.basic}</p>
          </Card.Body>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Lista utilizatorilor</h2>
      <div className="overflow-x-auto mb-12">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Nume</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rol</th>
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
                <td className="py-3 px-4 space-x-2">
                  {user.rol === "basic" ? (
                        <>
                        <Button size="sm" onClick={() => updateRole(user, "premium")}>Premium</Button>
                        <Button size="sm" onClick={() => updateRole(user, "admin")}>Admin</Button>
                        </>
                    ) : (
                        <span className="text-gray-500">-</span>
                )}
                {user.rol === "premium" && (
                        <Button size="sm" onClick={() => updateRole(user, "admin")}>Admin</Button>
            )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diagramele apar ACUM după lista utilizatorilor */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Diagrame</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <figure>
            <img
              src="/diagrams/Picture4.png"
              alt="Distribuția tipurilor de dizabilități"
              className="w-full h-auto rounded-md"
            />
            <figcaption className="text-sm text-center mt-2">
              Majoritatea participanților au raportat dizabilități motorii, urmate
              de cazuri cognitive.
            </figcaption>
          </figure>
          <figure>
            <img
              src="/diagrams/Picture1.png"
              alt="Niveluri de mărire a textului"
              className="w-full h-auto rounded-md"
            />
            <figcaption className="text-sm text-center mt-2">
              O parte a publicului mărește textul peste 150%, deci interfața
              trebuie să suporte mărirea.
            </figcaption>
          </figure>
          <figure>
            <img
              src="/diagrams/Picture2.png"
              alt="Preferințe notificări"
              className="w-full h-auto rounded-md"
            />
            <figcaption className="text-sm text-center mt-2">
              Mulți utilizatori preferă emailul sau SMS-ul pentru notificări,
              iar unii nu doresc deloc.
            </figcaption>
          </figure>
          <figure>
            <img
              src="/diagrams/Picture3.png"
              alt="Tehnologii asistive utilizate"
              className="w-full h-auto rounded-md"
            />
            <figcaption className="text-sm text-center mt-2">
              Navigarea cu tastatura este cea mai folosită tehnologie asistivă.
            </figcaption>
          </figure>
          
          <figure>
            <img
              src="/diagrams/image1.png"
              alt="Corelații între probleme"
              className="w-full h-auto rounded-md"
            />
            <figcaption className="text-sm text-center mt-2">
              Problemele multimedia și cele de interacțiune apar adesea împreună,
              în timp ce designul vizual este perceput separat.
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPage

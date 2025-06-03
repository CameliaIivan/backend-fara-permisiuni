"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function AdminRoute({ children }) {
  const { currentUser, loading, isAdmin } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute

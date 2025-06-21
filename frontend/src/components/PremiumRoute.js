"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function PremiumRoute({ children }) {
  const { currentUser, loading, isPremium } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!currentUser || !isPremium) {
    return <Navigate to="/" />
  }

  return children
}

export default PremiumRoute
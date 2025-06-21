"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"
import { API_URL } from "../config"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const user = response.data
          if (user && user.id_utilizator && !user.id) {
            user.id = user.id_utilizator
          }
          setCurrentUser(user)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Auth verification error:", error)
          logout()
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [token])

  // Login function
  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", { email, password })
      console.log("API URL:", `${API_URL}/auth/login`)

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        parola: password,
      })

      console.log("Login response:", response.data)

      const { token, user } = response.data
      localStorage.setItem("token", token)
      setToken(token)
      setCurrentUser(user)
      return user
    } catch (error) {
      console.error("Login error:", error.response?.data || error)
      throw error.response?.data?.error || "Login failed"
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      const { token, user } = response.data
      localStorage.setItem("token", token)
      setToken(token)
      setCurrentUser(user)
      return user
    } catch (error) {
      console.error("Registration error:", error.response?.data || error)
      throw error.response?.data?.error || "Registration failed"
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setCurrentUser(null)
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/update/${currentUser.id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const updatedUser = { ...currentUser, ...response.data }
      if (updatedUser.id_utilizator && !updatedUser.id) {
        updatedUser.id = updatedUser.id_utilizator
      }
      setCurrentUser(updatedUser)
      return response.data
    } catch (error) {
      throw error.response?.data?.error || "Profile update failed"
    }
  }

  const value = {
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin: currentUser?.rol === "admin",
    isPremium: currentUser?.rol === "premium" || currentUser?.rol === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
// context/AuthContext.jsx
// import React, { createContext, useState, useEffect, useContext } from 'react'
// import axios from 'axios'
// import { useRouter } from 'next/router'

// const AuthContext = createContext()

// export function useAuth() {
//   return useContext(AuthContext)
// }

// export function AuthProvider({ children }) {
//   const router = useRouter()
//   const [currentUser, setCurrentUser] = useState(null)
//   const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (token) {
//       axios
//         .get('http://localhost:4848/api/auth/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then(res => { setCurrentUser(res.data); setLoading(false) })
//         .catch(() => { logout(); setLoading(false) })
//     } else {
//       setLoading(false)
//     }
//   }, [token])

//   const login = async (email, parola) => {
//     const res = await axios.post('http://localhost:4848/api/auth/login', { email, parola })
//     localStorage.setItem('token', res.data.token)
//     setToken(res.data.token)
//     setCurrentUser(res.data.user)
//   }

//   const register = async ({ nume, email, parola }) => {
//     const res = await axios.post('http://localhost:4848/api/auth/register', { nume, email, parola })
//     localStorage.setItem('token', res.data.token)
//     setToken(res.data.token)
//     setCurrentUser(res.data.user)
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     setToken(null)
//     setCurrentUser(null)
//     router.push('/login')
//   }

//   return (
//     <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

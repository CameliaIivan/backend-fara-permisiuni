import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { getNotifications } from "../services/socialService"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export function useNotifications() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }) {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // ✅ Stabilizează funcția cu useCallback
  const fetchNotifications = useCallback(async () => {
    if (!token) return
    try {
      const data = await getNotifications()
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.este_citita).length)
    } catch (e) {
      console.error("Notification fetch error", e)
    }
  }, [token]) // ← Se recreează doar dacă token-ul se schimbă

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const value = { notifications, unreadCount, refresh: fetchNotifications }
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

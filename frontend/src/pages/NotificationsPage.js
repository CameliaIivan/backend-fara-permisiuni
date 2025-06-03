"use client"

import { useState, useEffect } from "react"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../services/socialService"
import Card from "../components/Card"
import Button from "../components/Button"
import Alert from "../components/Alert"

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const data = await getNotifications()
        setNotifications(data)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setError("A apărut o eroare la încărcarea notificărilor. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id_notificare === id ? { ...notification, este_citita: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      setError("A apărut o eroare la marcarea notificării ca citită.")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications((prev) => prev.map((notification) => ({ ...notification, este_citita: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      setError("A apărut o eroare la marcarea tuturor notificărilor ca citite.")
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.este_citita).length

  if (loading) {
    return <div className="text-center py-8">Se încarcă notificările...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notificări</h1>
        {unreadCount > 0 && <Button onClick={handleMarkAllAsRead}>Marchează toate ca citite</Button>}
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">Nu ai nicio notificare.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id_notificare}
              className={`${!notification.este_citita ? "border-l-4 border-secondary-500" : ""}`}
            >
              <Card.Body className="flex justify-between items-center">
                <div>
                  <p className="whitespace-pre-line">{notification.continut}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(notification.data).toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!notification.este_citita && (
                  <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id_notificare)}>
                    Marchează ca citită
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage

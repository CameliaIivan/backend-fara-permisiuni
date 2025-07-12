"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../services/socialService"
import { useNotifications } from "../contexts/NotificationContext"
import Toggle from "../components/Toggle"
import Card from "../components/Card"
import Button from "../components/Button"
import Alert from "../components/Alert"

function getInitialSettings() {
  const saved = localStorage.getItem("notificationSettings")
  return saved
    ? JSON.parse(saved)
    : { inApp: true, email: false, sms: false }
}

function NotificationsPage() {
  const { notifications: contextNotifications, refresh } = useNotifications()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [settings, setSettings] = useState(getInitialSettings())

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await refresh()
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setError("A apărut o eroare la încărcarea notificărilor. Vă rugăm încercați din nou.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refresh])
  useEffect(() => {
    setNotifications(contextNotifications)
  }, [contextNotifications])

  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings))
  }, [settings])

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id_notificare === id ? { ...notification, este_citita: true } : notification,
        ),
      )
      refresh()
    } catch (error) {
      console.error("Error marking notification as read:", error)
      setError("A apărut o eroare la marcarea notificării ca citită.")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications((prev) => prev.map((notification) => ({ ...notification, este_citita: true })))
      refresh()
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
                  {/* <p className="whitespace-pre-line">{notification.continut}</p> */}
                  <p
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: notification.continut }}
                  ></p>
                  {notification.id_eveniment && (
                    <p className="mt-2">
                      <Link
                        to={`/events/${notification.id_eveniment}`}
                        className="text-primary-600 underline"
                        onClick={() => handleMarkAsRead(notification.id_notificare)}
                      >
                        Vezi eveniment
                      </Link>
                    </p>
                  )}
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

      <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Setări notificări</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Notificări în aplicație</span>
          <Toggle
            id="inApp"
            checked={settings.inApp}
            onChange={() => setSettings({ ...settings, inApp: !settings.inApp })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Notificări prin email</span>
          <Toggle
            id="email"
            checked={settings.email}
            onChange={() => setSettings({ ...settings, email: !settings.email })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Notificări prin SMS</span>
          <Toggle
            id="sms"
            checked={settings.sms}
            onChange={() => setSettings({ ...settings, sms: !settings.sms })}
          />
        </div>
      </div>
    </div>
    </div>
  )
}

export default NotificationsPage

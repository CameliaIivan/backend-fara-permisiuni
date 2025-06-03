const { Notificare, User } = require("../models")

module.exports = {
  getAll: async (req, res) => {
    try {
      const userId = req.user.id

      // Get all notifications for this user
      const notificari = await Notificare.findAll({
        where: { id_utilizator: userId },
        order: [["data", "DESC"]],
      })

      res.json(notificari)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getNotificareById: async (req, res) => {
    try {
      const notificareId = req.params.id
      const userId = req.user.id

      // Find the notification
      const notificare = await Notificare.findByPk(notificareId)
      if (!notificare) {
        return res.status(404).json({ error: "Notificare not found" })
      }

      // Check if the notification belongs to the user
      if (notificare.id_utilizator !== userId && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      res.json(notificare)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createNotificare: async (req, res) => {
    try {
      const { id_utilizator, continut } = req.body

      // Check if the user exists
      const user = await User.findByPk(id_utilizator)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      // Create the notification
      const notificare = await Notificare.create({
        id_utilizator,
        continut,
      })

      res.status(201).json(notificare)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateNotificare: async (req, res) => {
    try {
      const notificareId = req.params.id
      const userId = req.user.id

      // Find the notification
      const notificare = await Notificare.findByPk(notificareId)
      if (!notificare) {
        return res.status(404).json({ error: "Notificare not found" })
      }

      // Check if the notification belongs to the user
      if (notificare.id_utilizator !== userId && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Update the notification
      await notificare.update(req.body)

      res.json(notificare)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  markAsRead: async (req, res) => {
    try {
      const notificareId = req.params.id
      const userId = req.user.id

      // Find the notification
      const notificare = await Notificare.findByPk(notificareId)
      if (!notificare) {
        return res.status(404).json({ error: "Notificare not found" })
      }

      // Check if the notification belongs to the user
      if (notificare.id_utilizator !== userId) {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Mark as read
      await notificare.update({ este_citita: true })

      res.json(notificare)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  markAllAsRead: async (req, res) => {
    try {
      const userId = req.user.id

      // Mark all notifications as read
      await Notificare.update({ este_citita: true }, { where: { id_utilizator: userId, este_citita: false } })

      res.json({ message: "All notifications marked as read" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteNotificare: async (req, res) => {
    try {
      const notificareId = req.params.id
      const userId = req.user.id

      // Find the notification
      const notificare = await Notificare.findByPk(notificareId)
      if (!notificare) {
        return res.status(404).json({ error: "Notificare not found" })
      }

      // Check if the notification belongs to the user
      if (notificare.id_utilizator !== userId && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Delete the notification
      await notificare.destroy()

      res.json({ message: "Notificare deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

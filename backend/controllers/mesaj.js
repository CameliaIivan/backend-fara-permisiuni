const { Mesaj, Conversatie, User } = require("../models")
const { Op } = require("sequelize")

module.exports = {
  getAll: async (req, res) => {
    try {
      const userId = req.user.id

      // Find all conversations where the user is a participant
      const conversatii = await Conversatie.findAll({
        where: {
          [Op.or]: [{ id_utilizator_1: userId }, { id_utilizator_2: userId }],
        },
        attributes: ["id_conversatie"],
      })

      const conversatieIds = conversatii.map((c) => c.id_conversatie)

      // Get all messages from these conversations
      const mesaje = await Mesaj.findAll({
        where: {
          id_conversatie: {
            [Op.in]: conversatieIds,
          },
        },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: Conversatie,
          },
        ],
        order: [["data_trimitere", "DESC"]],
        limit: 100,
      })

      res.json(mesaje)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getMesajById: async (req, res) => {
    try {
      const mesajId = req.params.id
      const userId = req.user.id

      // Find the message
      const mesaj = await Mesaj.findByPk(mesajId, {
        include: [
          {
            model: Conversatie,
          },
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      if (!mesaj) {
        return res.status(404).json({ error: "Mesaj not found" })
      }

      // Check if the user is a participant in the conversation
      const conversatie = mesaj.conversatie
      if (conversatie.id_utilizator_1 !== userId && conversatie.id_utilizator_2 !== userId) {
        return res.status(403).json({ error: "Unauthorized" })
      }

      res.json(mesaj)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getMesajeByConversatie: async (req, res) => {
    try {
      const conversatieId = req.params.idConversatie
      const userId = req.user.id

      // Check if the conversation exists and the user is a participant
      const conversatie = await Conversatie.findByPk(conversatieId)
      if (!conversatie) {
        return res.status(404).json({ error: "Conversatie not found" })
      }

      if (conversatie.id_utilizator_1 !== userId && conversatie.id_utilizator_2 !== userId) {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Get all messages from this conversation
      const mesaje = await Mesaj.findAll({
        where: { id_conversatie: conversatieId },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
        order: [["data_trimitere", "ASC"]],
      })

      res.json(mesaje)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createMesaj: async (req, res) => {
    try {
      const { id_conversatie, continut } = req.body
      const id_expeditor = req.user.id

      // Check if the conversation exists and the user is a participant
      const conversatie = await Conversatie.findByPk(id_conversatie)
      if (!conversatie) {
        return res.status(404).json({ error: "Conversatie not found" })
      }

      if (conversatie.id_utilizator_1 !== id_expeditor && conversatie.id_utilizator_2 !== id_expeditor) {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Create the message
      const mesaj = await Mesaj.create({
        id_conversatie,
        id_expeditor,
        continut,
      })

      // Get the complete message with user info
      const completeMesaj = await Mesaj.findByPk(mesaj.id_mesaj, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.status(201).json(completeMesaj)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateMesaj: async (req, res) => {
    try {
      const mesajId = req.params.id
      const { continut } = req.body
      const userId = req.user.id

      // Find the message
      const mesaj = await Mesaj.findByPk(mesajId)
      if (!mesaj) {
        return res.status(404).json({ error: "Mesaj not found" })
      }

      // Check if the user is the sender of the message
      if (mesaj.id_expeditor !== userId) {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Update the message
      await mesaj.update({ continut })

      // Get the updated message with user info
      const updatedMesaj = await Mesaj.findByPk(mesaj.id_mesaj, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.json(updatedMesaj)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteMesaj: async (req, res) => {
    try {
      const mesajId = req.params.id
      const userId = req.user.id

      // Find the message
      const mesaj = await Mesaj.findByPk(mesajId)
      if (!mesaj) {
        return res.status(404).json({ error: "Mesaj not found" })
      }

      // Check if the user is the sender of the message
      if (mesaj.id_expeditor !== userId && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Delete the message
      await mesaj.destroy()

      res.json({ message: "Mesaj deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

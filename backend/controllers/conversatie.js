const { Conversatie, User, Mesaj } = require("../models")
const { Op } = require("sequelize")

module.exports = {
  getAll: async (req, res) => {
    try {
      const userId = req.user.id

      // Find all conversations where the current user is a participant
      const conversatii = await Conversatie.findAll({
        where: {
          [Op.or]: [{ id_utilizator_1: userId }, { id_utilizator_2: userId }],
        },
        include: [
          {
            model: User,
            as: "User1",
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: User,
            as: "User2",
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: Mesaj,
            limit: 1,
            order: [["data_trimitere", "DESC"]],
            attributes: ["continut", "data_trimitere"],
          },
        ],
      })

      res.json(conversatii)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getConversatieById: async (req, res) => {
    try {
      const conversatieId = req.params.id
      const userId = req.user.id

      // Find the conversation and ensure the current user is a participant
      const conversatie = await Conversatie.findOne({
        where: {
          id_conversatie: conversatieId,
          [Op.or]: [{ id_utilizator_1: userId }, { id_utilizator_2: userId }],
        },
        include: [
          {
            model: User,
            as: "User1",
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: User,
            as: "User2",
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      if (!conversatie) {
        return res.status(404).json({ error: "Conversatie not found or access denied" })
      }

      // Get messages for this conversation
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

      res.json({
        conversatie,
        mesaje,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createConversatie: async (req, res) => {
    try {
      const { id_destinatar } = req.body
      const id_expeditor = req.user.id

      // Check if the recipient exists
      const destinatar = await User.findByPk(id_destinatar)
      if (!destinatar) {
        return res.status(404).json({ error: "Recipient not found" })
      }

      // Check if a conversation already exists between these users
      const existingConversatie = await Conversatie.findOne({
        where: {
          [Op.or]: [
            {
              id_utilizator_1: id_expeditor,
              id_utilizator_2: id_destinatar,
            },
            {
              id_utilizator_1: id_destinatar,
              id_utilizator_2: id_expeditor,
            },
          ],
        },
      })

      if (existingConversatie) {
        return res.json(existingConversatie)
      }

      // Create a new conversation
      const newConversatie = await Conversatie.create({
        id_utilizator_1: id_expeditor,
        id_utilizator_2: id_destinatar,
      })

      // Get the complete conversation with user info
      const conversatie = await Conversatie.findByPk(newConversatie.id_conversatie, {
        include: [
          {
            model: User,
            as: "User1",
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: User,
            as: "User2",
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.status(201).json(conversatie)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteConversatie: async (req, res) => {
    try {
      const conversatieId = req.params.id
      const userId = req.user.id

      // Find the conversation and ensure the current user is a participant
      const conversatie = await Conversatie.findOne({
        where: {
          id_conversatie: conversatieId,
          [Op.or]: [{ id_utilizator_1: userId }, { id_utilizator_2: userId }],
        },
      })

      if (!conversatie) {
        return res.status(404).json({ error: "Conversatie not found or access denied" })
      }

      // Delete all messages in the conversation
      await Mesaj.destroy({
        where: { id_conversatie: conversatieId },
      })

      // Delete the conversation
      await conversatie.destroy()

      res.json({ message: "Conversatie deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

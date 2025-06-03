const { Grup, User, GrupUtilizator, Postare } = require("../models")
const { Op } = require("sequelize")

module.exports = {
  getAll: async (req, res) => {
    try {
      // Get all public groups and private groups where the user is a member
      const userId = req.user ? req.user.id : null

      let whereClause = {}

      if (userId) {
        whereClause = {
          [Op.or]: [
            { este_privata: false },
            {
              este_privata: true,
              "$GrupUtilizatori.id_utilizator$": userId,
            },
          ],
        }
      } else {
        whereClause = { este_privata: false }
      }

      const grupuri = await Grup.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: GrupUtilizator,
            as: "GrupUtilizatori",
            required: false,
          },
        ],
        order: [["data_crearii", "DESC"]],
      })

      res.json(grupuri)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getGrupById: async (req, res) => {
    try {
      const grupId = req.params.id
      const userId = req.user ? req.user.id : null

      const grup = await Grup.findByPk(grupId, {
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: User,
            through: GrupUtilizator,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      if (!grup) return res.status(404).json({ error: "Grup not found" })

      // Check if the group is private and the user is not a member
      if (grup.este_privata && userId) {
        const isMember = await GrupUtilizator.findOne({
          where: {
            id_grup: grupId,
            id_utilizator: userId,
          },
        })

        if (!isMember && grup.creat_de !== userId) {
          return res.status(403).json({ error: "This is a private group" })
        }
      } else if (grup.este_privata && !userId) {
        return res.status(403).json({ error: "This is a private group" })
      }

      // Get recent posts for this group
      const postari = await Postare.findAll({
        where: { id_grup: grupId },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
        order: [["data_postarii", "DESC"]],
        limit: 10,
      })

      res.json({
        grup,
        postari,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createGrup: async (req, res) => {
    try {
      const userId = req.user.id

      // Check if user has permission to create groups
      if (req.user.rol === "basic") {
        return res.status(403).json({ error: "Only premium or admin users can create groups" })
      }

      const { nume, descriere, este_privata = false } = req.body

      const newGrup = await Grup.create({
        nume,
        descriere,
        creat_de: userId,
        este_privata,
      })

      // Add the creator as a member with admin role
      await GrupUtilizator.create({
        id_utilizator: userId,
        id_grup: newGrup.id_grup,
        rol_in_grup: "admin",
      })

      // Get the complete group with user info
      const grup = await Grup.findByPk(newGrup.id_grup, {
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.status(201).json(grup)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateGrup: async (req, res) => {
    try {
      const grupId = req.params.id
      const userId = req.user.id

      const grup = await Grup.findByPk(grupId)
      if (!grup) return res.status(404).json({ error: "Grup not found" })

      // Check if user has permission to update this group
      if (grup.creat_de !== userId && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      const { nume, descriere, este_privata } = req.body

      await grup.update({
        nume,
        descriere,
        este_privata,
      })

      // Get the updated group with user info
      const updatedGrup = await Grup.findByPk(grup.id_grup, {
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.json(updatedGrup)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteGrup: async (req, res) => {
    try {
      const grupId = req.params.id
      const userId = req.user.id

      const grup = await Grup.findByPk(grupId)
      if (!grup) return res.status(404).json({ error: "Grup not found" })

      // Check if user has permission to delete this group
      if (grup.creat_de !== userId && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Delete all memberships
      await GrupUtilizator.destroy({
        where: { id_grup: grupId },
      })

      // Delete all posts in the group
      await Postare.destroy({
        where: { id_grup: grupId },
      })

      // Delete the group
      await grup.destroy()

      res.json({ message: "Grup deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

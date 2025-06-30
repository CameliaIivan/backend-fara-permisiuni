const { Spital, Specializare, SpitalSpecializare, User } = require("../models")
const { Op } = require("sequelize")

module.exports = {
  getAll: async (req, res) => {
    try {
      // Get query parameters for filtering
      const { nume, locatie, tip_serviciu, grad_accesibilitate, id_specializare } = req.query

      // Build where clause based on filters
      const whereClause = {}

      if (nume) {
        whereClause.nume = { [Op.like]: `%${nume}%` }
      }

      if (locatie) {
        whereClause.locatie = { [Op.like]: `%${locatie}%` }
      }

      if (tip_serviciu) {
        whereClause.tip_serviciu = tip_serviciu
      }

      if (grad_accesibilitate) {
        whereClause.grad_accesibilitate = grad_accesibilitate
      }

      // Build include clause for specialization filter
      let includeClause = [
        {
          model: Specializare,
          as: "specializari",
          through: SpitalSpecializare,
          attributes: ["id_specializare", "nume_specializare"],
        },
        {
          model: User,
          attributes: ["id_utilizator", "nume"],
        },
      ]

      if (id_specializare) {
        includeClause = [
          {
            model: Specializare,
            as: "specializari",
            through: SpitalSpecializare,
            attributes: ["id_specializare", "nume_specializare"],
            where: { id_specializare },
          },
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ]
      }

      // Get all hospitals with their specializations
      const spitale = await Spital.findAll({
        where: whereClause,
        include: includeClause,
        order: [["nume", "ASC"]],
      })

      res.json(spitale)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getSpitalById: async (req, res) => {
    try {
      const spitalId = req.params.id

      const spital = await Spital.findByPk(spitalId, {
        include: [
          {
            model: Specializare,
            as: "specializari",
            through: SpitalSpecializare,
            attributes: ["id_specializare", "nume_specializare"],
          },
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      if (!spital) {
        return res.status(404).json({ error: "Spital not found" })
      }

      res.json(spital)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createSpital: async (req, res) => {
    try {
      // Only admin can create hospitals
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can create hospitals" })
      }

      const { nume, locatie, tip_serviciu, grad_accesibilitate, contact, website, descriere, specializari } = req.body

      // Create the hospital
      const spital = await Spital.create({
        nume,
        locatie,
        tip_serviciu,
        grad_accesibilitate,
        contact,
        website,
        descriere,
        creat_de: req.user.id,
      })

      // Add specializations if provided
      if (specializari && specializari.length > 0) {
        const spitalSpecializari = specializari.map((id_specializare) => ({
          id_spital: spital.id_spital,
          id_specializare,
        }))

        await SpitalSpecializare.bulkCreate(spitalSpecializari)
      }

      // Get the complete hospital with specializations
      const completeSpital = await Spital.findByPk(spital.id_spital, {
        include: [
          {
            model: Specializare,
            as: "specializari",
            through: SpitalSpecializare,
            attributes: ["id_specializare", "nume_specializare"],
          },
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.status(201).json(completeSpital)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateSpital: async (req, res) => {
    try {
      // Only admin can update hospitals
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can update hospitals" })
      }

      const spitalId = req.params.id

      const spital = await Spital.findByPk(spitalId)
      if (!spital) {
        return res.status(404).json({ error: "Spital not found" })
      }

      const {
        nume,
        locatie,
        tip_serviciu,
        grad_accesibilitate,
        contact,
        website,
        descriere,
        specializari,
      } = req.body

      // Build update payload only with defined fields
      const updateData = {
        modificat_de: req.user.id,
        data_modificarii: new Date(),
      }

      if (nume !== undefined) updateData.nume = nume
      if (locatie !== undefined) updateData.locatie = locatie
      if (tip_serviciu !== undefined) updateData.tip_serviciu = tip_serviciu
      if (grad_accesibilitate !== undefined)
        updateData.grad_accesibilitate = grad_accesibilitate
      if (contact !== undefined) updateData.contact = contact
      if (website !== undefined) updateData.website = website
      if (descriere !== undefined) updateData.descriere = descriere

      // Update the hospital
      await spital.update(updateData)
      // Update specializations if provided
      if (specializari) {
        // Remove all current specializations
        await SpitalSpecializare.destroy({
          where: { id_spital: spitalId },
        })

        // Add new specializations
        if (specializari.length > 0) {
          const spitalSpecializari = specializari.map((id_specializare) => ({
            id_spital: spitalId,
            id_specializare,
          }))

          await SpitalSpecializare.bulkCreate(spitalSpecializari)
        }
      }

      // Get the updated hospital with specializations
      const updatedSpital = await Spital.findByPk(spitalId, {
        include: [
          {
            model: Specializare,
            as: "specializari",
            through: SpitalSpecializare,
            attributes: ["id_specializare", "nume_specializare"],
          },
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.json(updatedSpital)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteSpital: async (req, res) => {
    try {
      // Only admin can delete hospitals
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can delete hospitals" })
      }

      const spitalId = req.params.id

      const spital = await Spital.findByPk(spitalId)
      if (!spital) {
        return res.status(404).json({ error: "Spital not found" })
      }

      // Remove all specializations
      await SpitalSpecializare.destroy({
        where: { id_spital: spitalId },
      })

      // Delete the hospital
      await spital.destroy()

      res.json({ message: "Spital deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

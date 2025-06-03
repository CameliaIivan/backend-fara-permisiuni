const { Specializare, SpitalSpecializare, Spital } = require("../models")

module.exports = {
  getAll: async (req, res) => {
    try {
      const specializari = await Specializare.findAll({
        order: [["nume_specializare", "ASC"]],
      })
      res.json(specializari)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getSpecializareById: async (req, res) => {
    try {
      const specializareId = req.params.id

      const specializare = await Specializare.findByPk(specializareId)
      if (!specializare) {
        return res.status(404).json({ error: "Specializare not found" })
      }

      // Get all hospitals with this specialization
      const spitale = await Spital.findAll({
        include: [
          {
            model: Specializare,
            where: { id_specializare: specializareId },
          },
        ],
      })

      res.json({
        specializare,
        spitale,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createSpecializare: async (req, res) => {
    try {
      // Only admin can create specializations
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can create specializations" })
      }

      const { nume_specializare, descriere } = req.body

      // Check if specialization already exists
      const existingSpecializare = await Specializare.findOne({
        where: { nume_specializare },
      })

      if (existingSpecializare) {
        return res.status(400).json({ error: "Specialization already exists" })
      }

      // Create the specialization
      const specializare = await Specializare.create({
        nume_specializare,
        descriere,
      })

      res.status(201).json(specializare)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateSpecializare: async (req, res) => {
    try {
      // Only admin can update specializations
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can update specializations" })
      }

      const specializareId = req.params.id

      const specializare = await Specializare.findByPk(specializareId)
      if (!specializare) {
        return res.status(404).json({ error: "Specializare not found" })
      }

      const { nume_specializare, descriere } = req.body

      // Check if the new name already exists (if name is being changed)
      if (nume_specializare && nume_specializare !== specializare.nume_specializare) {
        const existingSpecializare = await Specializare.findOne({
          where: { nume_specializare },
        })

        if (existingSpecializare) {
          return res.status(400).json({ error: "Specialization name already exists" })
        }
      }

      // Update the specialization
      await specializare.update({
        nume_specializare,
        descriere,
      })

      res.json(specializare)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteSpecializare: async (req, res) => {
    try {
      // Only admin can delete specializations
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can delete specializations" })
      }

      const specializareId = req.params.id

      const specializare = await Specializare.findByPk(specializareId)
      if (!specializare) {
        return res.status(404).json({ error: "Specializare not found" })
      }

      // Check if there are hospitals with this specialization
      const hasHospitals = await SpitalSpecializare.findOne({
        where: { id_specializare: specializareId },
      })

      if (hasHospitals) {
        return res.status(400).json({ error: "Cannot delete specialization that is used by hospitals" })
      }

      // Delete the specialization
      await specializare.destroy()

      res.json({ message: "Specializare deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

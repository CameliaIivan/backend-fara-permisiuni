const { SpitalSpecializare, Spital, Specializare } = require("../models")

module.exports = {
  // Get all specializations for a hospital
  getSpecializariBySpital: async (req, res) => {
    try {
      const spitalId = req.params.spitalId

      // Check if the hospital exists
      const spital = await Spital.findByPk(spitalId)
      if (!spital) {
        return res.status(404).json({ error: "Spital not found" })
      }

      // Get all specializations for this hospital
      const specializari = await Specializare.findAll({
        include: [
          {
            model: Spital,
            where: { id_spital: spitalId },
            attributes: [],
          },
        ],
      })

      res.json(specializari)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Get all hospitals with a specific specialization
  getSpitaleBySpecializare: async (req, res) => {
    try {
      const specializareId = req.params.specializareId

      // Check if the specialization exists
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
            attributes: [],
          },
        ],
      })

      res.json(spitale)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Add a specialization to a hospital
  addSpecializareToSpital: async (req, res) => {
    try {
      // Only admin can add specializations to hospitals
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can add specializations to hospitals" })
      }

      const { id_spital, id_specializare } = req.body

      // Check if the hospital exists
      const spital = await Spital.findByPk(id_spital)
      if (!spital) {
        return res.status(404).json({ error: "Spital not found" })
      }

      // Check if the specialization exists
      const specializare = await Specializare.findByPk(id_specializare)
      if (!specializare) {
        return res.status(404).json({ error: "Specializare not found" })
      }

      // Check if the relationship already exists
      const existingRelation = await SpitalSpecializare.findOne({
        where: {
          id_spital,
          id_specializare,
        },
      })

      if (existingRelation) {
        return res.status(400).json({ error: "Specialization already added to this hospital" })
      }

      // Create the relationship
      const relation = await SpitalSpecializare.create({
        id_spital,
        id_specializare,
      })

      res.status(201).json(relation)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Remove a specialization from a hospital
  removeSpecializareFromSpital: async (req, res) => {
    try {
      // Only admin can remove specializations from hospitals
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can remove specializations from hospitals" })
      }

      const { id_spital, id_specializare } = req.body

      // Check if the relationship exists
      const relation = await SpitalSpecializare.findOne({
        where: {
          id_spital,
          id_specializare,
        },
      })

      if (!relation) {
        return res.status(404).json({ error: "Relationship not found" })
      }

      // Delete the relationship
      await relation.destroy()

      res.json({ message: "Specialization removed from hospital" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

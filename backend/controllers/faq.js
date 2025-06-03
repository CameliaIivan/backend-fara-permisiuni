const { Faq, User } = require("../models")

module.exports = {
  getAll: async (req, res) => {
    try {
      const faqs = await Faq.findAll({
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
        order: [["data_crearii", "DESC"]],
      })
      res.json(faqs)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getFaqById: async (req, res) => {
    try {
      const faq = await Faq.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      if (!faq) return res.status(404).json({ error: "FAQ not found" })

      res.json(faq)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createFaq: async (req, res) => {
    try {
      // Only admin can create FAQs
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can create FAQs" })
      }

      const { intrebare, raspuns } = req.body
      const creat_de = req.user.id

      const newFaq = await Faq.create({
        intrebare,
        raspuns,
        creat_de,
      })

      // Get the complete FAQ with user info
      const faq = await Faq.findByPk(newFaq.id_faq, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.status(201).json(faq)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateFaq: async (req, res) => {
    try {
      // Only admin can update FAQs
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can update FAQs" })
      }

      const faq = await Faq.findByPk(req.params.id)
      if (!faq) return res.status(404).json({ error: "FAQ not found" })

      const { intrebare, raspuns } = req.body

      await faq.update({
        intrebare,
        raspuns,
        data_modificarii: new Date(),
      })

      // Get the updated FAQ with user info
      const updatedFaq = await Faq.findByPk(faq.id_faq, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.json(updatedFaq)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteFaq: async (req, res) => {
    try {
      // Only admin can delete FAQs
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can delete FAQs" })
      }

      const faq = await Faq.findByPk(req.params.id)
      if (!faq) return res.status(404).json({ error: "FAQ not found" })

      await faq.destroy()

      res.json({ message: "FAQ deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

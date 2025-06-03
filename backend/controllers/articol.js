const { Articol } = require("../models")

module.exports = {
  getAll: async (req, res) => {
    try {
      const articole = await Articol.findAll()
      res.json(articole)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getArticolById: async (req, res) => {
    try {
      const articol = await Articol.findByPk(req.params.id)
      if (!articol) return res.status(404).json({ error: "Articol not found" })
      res.json(articol)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createArticol: async (req, res) => {
    try {
      const newArticol = await Articol.create(req.body)
      res.status(201).json(newArticol)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateArticol: async (req, res) => {
    try {
      const articol = await Articol.findByPk(req.params.id)
      if (!articol) return res.status(404).json({ error: "Articol not found" })
      await articol.update(req.body)
      res.json(articol)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteArticol: async (req, res) => {
    try {
      const articol = await Articol.findByPk(req.params.id)
      if (!articol) return res.status(404).json({ error: "Articol not found" })
      await articol.destroy()
      res.json({ message: "Articol deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

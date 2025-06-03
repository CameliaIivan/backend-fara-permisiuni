const { CategorieArticol } = require("../models")

module.exports = {
  getAll: async (req, res) => {
    try {
      const categorii = await CategorieArticol.findAll()
      res.json(categorii)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getCategorieById: async (req, res) => {
    try {
      const categorie = await CategorieArticol.findByPk(req.params.id)
      if (!categorie) return res.status(404).json({ error: "Categorie not found" })
      res.json(categorie)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createCategorie: async (req, res) => {
    try {
      const newCategorie = await CategorieArticol.create(req.body)
      res.status(201).json(newCategorie)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateCategorie: async (req, res) => {
    try {
      const categorie = await CategorieArticol.findByPk(req.params.id)
      if (!categorie) return res.status(404).json({ error: "Categorie not found" })
      await categorie.update(req.body)
      res.json(categorie)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteCategorie: async (req, res) => {
    try {
      const categorie = await CategorieArticol.findByPk(req.params.id)
      if (!categorie) return res.status(404).json({ error: "Categorie not found" })
      await categorie.destroy()
      res.json({ message: "Categorie deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

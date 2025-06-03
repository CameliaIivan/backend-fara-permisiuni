const { Comentariu, User } = require("../models")

module.exports = {
  getAll: async (req, res) => {
    try {
      const comentarii = await Comentariu.findAll({
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })
      res.json(comentarii)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getComentariuById: async (req, res) => {
    try {
      const comentariu = await Comentariu.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })
      if (!comentariu) return res.status(404).json({ error: "Comentariu not found" })
      res.json(comentariu)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getComentariiByPostare: async (req, res) => {
    try {
      const comentarii = await Comentariu.findAll({
        where: { id_postare: req.params.idPostare },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
        order: [["data_comentariu", "DESC"]],
      })
      res.json(comentarii)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createComentariu: async (req, res) => {
    try {
      const { id_postare, continut } = req.body
      const id_utilizator = req.user.id

      const newComentariu = await Comentariu.create({
        id_postare,
        id_utilizator,
        continut,
      })

      // Get the complete comment with user info
      const comentariu = await Comentariu.findByPk(newComentariu.id_comentariu, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.status(201).json(comentariu)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateComentariu: async (req, res) => {
    try {
      const comentariu = await Comentariu.findByPk(req.params.id)
      if (!comentariu) return res.status(404).json({ error: "Comentariu not found" })

      // Check if the user is the owner of the comment
      if (comentariu.id_utilizator !== req.user.id && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      await comentariu.update({ continut: req.body.continut })

      // Get the updated comment with user info
      const updatedComentariu = await Comentariu.findByPk(comentariu.id_comentariu, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.json(updatedComentariu)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteComentariu: async (req, res) => {
    try {
      const comentariu = await Comentariu.findByPk(req.params.id)
      if (!comentariu) return res.status(404).json({ error: "Comentariu not found" })

      // Check if the user is the owner of the comment or an admin
      if (comentariu.id_utilizator !== req.user.id && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      await comentariu.destroy()
      res.json({ message: "Comentariu deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

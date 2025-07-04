const { Eveniment, Postare, User, ParticipareEveniment, Notificare } = require("../models")
const { Op } = require("sequelize")

module.exports = {
  getAll: async (req, res) => {
    try {
      const evenimente = await Eveniment.findAll({
        where: { aprobat: true },
        include: [
          {
            model: Postare,
            include: [
              {
                model: User,
                attributes: ["id_utilizator", "nume"],
              },
            ],
          },
        ],
        order: [["data_eveniment", "ASC"]],
      })
      res.json(evenimente)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  getEvenimentById: async (req, res) => {
    try {
      const eveniment = await Eveniment.findByPk(req.params.id, {
        include: [
          {
            model: Postare,
            include: [
              {
                model: User,
                attributes: ["id_utilizator", "nume"],
              },
            ],
          },
          {
            model: ParticipareEveniment,
            include: [
              {
                model: User,
                attributes: ["id_utilizator", "nume"],
              },
            ],
          },
        ],
      })

      if (!eveniment) return res.status(404).json({ error: "Eveniment not found" })
      // if (!eveniment.aprobat && req.user.rol !== "admin") {
      //   return res.status(403).json({ error: "Event not approved" })
      // }

      res.json(eveniment)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  getUpcomingEvents: async (req, res) => {
    try {
      const evenimente = await Eveniment.findAll({
        where: {
          data_eveniment: {
            [Op.gte]: new Date(),
          },
          aprobat: true,
        },
        include: [
          {
            model: Postare,
            include: [
              {
                model: User,
                attributes: ["id_utilizator", "nume"],
              },
            ],
          },
        ],
        order: [["data_eveniment", "ASC"]],
        limit: 10,
      })

      res.json(evenimente)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  createEveniment: async (req, res) => {
    try {
      const userId = req.user.id
      const { titlu, continut, data_eveniment, locatie, 
        nr_maxim_participanti, alte_detalii, id_grup } = req.body
      if (req.user.rol === "basic") {
        return res.status(403).json({ error: "Only premium or admin users can create events" })
      }
      const postare = await Postare.create({
        titlu,
        continut,
        tip: "eveniment",
        creat_de: userId,
        id_grup,
      })
      const eveniment = await Eveniment.create({
        id_postare: postare.id_postare,
        data_eveniment,
        locatie,
        nr_maxim_participanti,
        alte_detalii,
        aprobat: false,
        respins: false,
      })
      // Notifică toți administratorii că există un eveniment ce necesită aprobare
      const admini = await User.findAll({ where: { rol: 'admin' } })
      await Promise.all(
        admini.map((admin) =>
          Notificare.create({
            id_utilizator: admin.id_utilizator,
            id_eveniment: eveniment.id_eveniment,
            continut: `Evenimentul "${titlu}" necesită aprobare`,
          })
        )
      )
      const completeEveniment = await Eveniment.findByPk(eveniment.id_eveniment, {
        include: [
          {
            model: Postare,
            include: [
              {
                model: User,
                attributes: ["id_utilizator", "nume"],
              },
            ],
          },
        ],
      })
      res.status(201).json(completeEveniment)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateEveniment: async (req, res) => {
    try {
      const eveniment = await Eveniment.findByPk(req.params.id, {
        include: [
          {
            model: Postare,
          },
        ],
      })

      if (!eveniment) return res.status(404).json({ error: "Eveniment not found" })

      // Check if user has permission to update this event
      const postare = eveniment.postare
      if (postare.creat_de !== req.user.id && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Update the event
      const { data_eveniment, locatie, nr_maxim_participanti, alte_detalii, aprobat } = req.body
      await eveniment.update({
        data_eveniment,
        locatie,
        nr_maxim_participanti,
        alte_detalii,
      })

      // Update the associated post if needed
      if (req.body.titlu || req.body.continut) {
        await postare.update({
          titlu: req.body.titlu || postare.titlu,
          continut: req.body.continut || postare.continut,
        })
      }

      // Get the updated event with post and user info
      const updatedEveniment = await Eveniment.findByPk(eveniment.id_eveniment, {
        include: [
          {
            model: Postare,
            include: [
              {
                model: User,
                attributes: ["id_utilizator", "nume"],
              },
            ],
          },
        ],
      })

      res.json(updatedEveniment)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  
  getPendingEvents: async (req, res) => {
    try {
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }
      const events = await Eveniment.findAll({
        where: { aprobat: false, respins: false },
        include: [
          {
            model: Postare,
            include: [{ model: User, attributes: ["id_utilizator", "nume"] }],
          },
        ],
        order: [["data_eveniment", "ASC"]],
      })
      res.json(events)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  approveEveniment: async (req, res) => {
    try {
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }
      const eveniment = await Eveniment.findByPk(req.params.id)
      if (!eveniment) {
        return res.status(404).json({ error: "Eveniment not found" })
      }
      await eveniment.update({ aprobat: true, respins: false })
      res.json(eveniment)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  rejectEveniment: async (req, res) => {
    try {
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }
      const eveniment = await Eveniment.findByPk(req.params.id)
      if (!eveniment) {
        return res.status(404).json({ error: "Eveniment not found" })
      }
      await eveniment.update({ aprobat: false, respins: true })
      res.json(eveniment)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  deleteEveniment: async (req, res) => {
    try {
      const eveniment = await Eveniment.findByPk(req.params.id, {
        include: [
          {
            model: Postare,
          },
        ],
      })

      if (!eveniment) return res.status(404).json({ error: "Eveniment not found" })

      // Check if user has permission to delete this event
      const postare = eveniment.postare
      if (postare.creat_de !== req.user.id && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Delete participations first
      await ParticipareEveniment.destroy({
        where: { id_eveniment: eveniment.id_eveniment },
      })

      // Delete the event
      await eveniment.destroy()

      // Delete the associated post
      await postare.destroy()

      res.json({ message: "Eveniment deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}
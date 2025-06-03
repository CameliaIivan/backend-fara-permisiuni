const {
  Postare,
  User,
  Grup,
  Comentariu,
  LikePostare,
  Eveniment,
  GrupUtilizator,
  ParticipareEveniment,
} = require("../models")
const { Op } = require("sequelize")

module.exports = {
  getAll: async (req, res) => {
    try {
      // Get query parameters for filtering
      const { id_grup, creat_de, tip } = req.query

      // Build where clause based on filters
      const whereClause = {}

      if (id_grup) {
        whereClause.id_grup = id_grup
      }

      if (creat_de) {
        whereClause.creat_de = creat_de
      }

      if (tip) {
        whereClause.tip = tip
      }

      // Get all posts with their creators and groups
      const postari = await Postare.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: Grup,
            attributes: ["id_grup", "nume"],
          },
          {
            model: Eveniment,
            required: false,
          },
        ],
        order: [["data_postarii", "DESC"]],
      })

      // For each post, get the number of comments and likes
      for (const postare of postari) {
        postare.dataValues.numar_comentarii = await Comentariu.count({
          where: { id_postare: postare.id_postare },
        })

        postare.dataValues.numar_like = await LikePostare.count({
          where: { id_postare: postare.id_postare },
        })
      }

      res.json(postari)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getPostareById: async (req, res) => {
    try {
      const postareId = req.params.id

      // Get the post with its creator, group, and event (if it's an event)
      const postare = await Postare.findByPk(postareId, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: Grup,
            attributes: ["id_grup", "nume"],
          },
          {
            model: Eveniment,
            required: false,
          },
        ],
      })

      if (!postare) {
        return res.status(404).json({ error: "Postare not found" })
      }

      // Check if the post is in a private group and the user is not a member
      if (postare.id_grup) {
        const grup = postare.grup
        if (grup && grup.este_privata) {
          // If user is not authenticated, deny access
          if (!req.user) {
            return res.status(403).json({ error: "This post is in a private group" })
          }

          // Check if user is a member of the group
          const isMember = await GrupUtilizator.findOne({
            where: {
              id_grup: postare.id_grup,
              id_utilizator: req.user.id,
            },
          })

          if (!isMember && grup.creat_de !== req.user.id && req.user.rol !== "admin") {
            return res.status(403).json({ error: "This post is in a private group" })
          }
        }
      }

      // Get comments for this post
      const comentarii = await Comentariu.findAll({
        where: { id_postare: postareId },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
        order: [["data_comentariu", "DESC"]],
      })

      // Get likes for this post
      const likes = await LikePostare.findAll({
        where: { id_postare: postareId },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      // Add comments and likes to the post
      postare.dataValues.comentarii = comentarii
      postare.dataValues.likes = likes
      postare.dataValues.numar_comentarii = comentarii.length
      postare.dataValues.numar_like = likes.length

      res.json(postare)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createPostare: async (req, res) => {
    try {
      const { titlu, continut, tip = "text", id_grup } = req.body
      const creat_de = req.user.id

      // If the post is in a group, check if the user is a member
      if (id_grup) {
        const grup = await Grup.findByPk(id_grup)
        if (!grup) {
          return res.status(404).json({ error: "Grup not found" })
        }

        // Check if user is a member of the group
        const isMember = await GrupUtilizator.findOne({
          where: {
            id_grup,
            id_utilizator: creat_de,
          },
        })

        if (!isMember && grup.creat_de !== creat_de && req.user.rol !== "admin") {
          return res.status(403).json({ error: "User is not a member of this group" })
        }
      }

      // Create the post
      const postare = await Postare.create({
        titlu,
        continut,
        tip,
        creat_de,
        id_grup,
      })

      // Get the complete post with user and group info
      const completePostare = await Postare.findByPk(postare.id_postare, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: Grup,
            attributes: ["id_grup", "nume"],
          },
        ],
      })

      res.status(201).json(completePostare)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updatePostare: async (req, res) => {
    try {
      const postareId = req.params.id
      const userId = req.user.id

      // Find the post
      const postare = await Postare.findByPk(postareId)
      if (!postare) {
        return res.status(404).json({ error: "Postare not found" })
      }

      // Check if the user is the creator of the post or an admin
      if (postare.creat_de !== userId && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // Update the post
      const { titlu, continut } = req.body
      await postare.update({
        titlu,
        continut,
      })

      // Get the updated post with user and group info
      const updatedPostare = await Postare.findByPk(postare.id_postare, {
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: Grup,
            attributes: ["id_grup", "nume"],
          },
        ],
      })

      res.json(updatedPostare)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deletePostare: async (req, res) => {
    try {
      const postareId = req.params.id
      const userId = req.user.id

      // Find the post
      const postare = await Postare.findByPk(postareId)
      if (!postare) {
        return res.status(404).json({ error: "Postare not found" })
      }

      // Check if the user is the creator of the post or an admin
      if (postare.creat_de !== userId && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Unauthorized" })
      }

      // If it's an event post, delete the event first
      if (postare.tip === "eveniment") {
        const eveniment = await Eveniment.findOne({
          where: { id_postare: postareId },
        })

        if (eveniment) {
          // Delete participations first
          await ParticipareEveniment.destroy({
            where: { id_eveniment: eveniment.id_eveniment },
          })

          // Delete the event
          await eveniment.destroy()
        }
      }

      // Delete all comments
      await Comentariu.destroy({
        where: { id_postare: postareId },
      })

      // Delete all likes
      await LikePostare.destroy({
        where: { id_postare: postareId },
      })

      // Delete the post
      await postare.destroy()

      res.json({ message: "Postare deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

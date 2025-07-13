const { LikePostare, Postare, User } = require("../models")

module.exports = {
  getAll: async (req, res) => {
    try {
      const likes = await LikePostare.findAll({
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
          {
            model: Postare,
            attributes: ["id_postare", "titlu"],
          },
        ],
      })
      res.json(likes)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getLikesByPost: async (req, res) => {
    try {
      const postId = req.params.postareId

      // Check if the post exists
      const post = await Postare.findByPk(postId)
      if (!post) {
        return res.status(404).json({ error: "Post not found" })
      }

      // Get all likes for this post
      const likes = await LikePostare.findAll({
        where: { id_postare: postId },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.json(likes)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createLike: async (req, res) => {
    try {
      const { id_postare } = req.body
      const id_utilizator = req.user.id

      // Check if the post exists
      const post = await Postare.findByPk(id_postare)
      if (!post) {
        return res.status(404).json({ error: "Post not found" })
      }

      // Check if the user already liked this post
      const existingLike = await LikePostare.findOne({
        where: {
          id_postare,
          id_utilizator,
        },
      })

      if (existingLike) {
        return res.status(400).json({ error: "User already liked this post" })
      }

      // Create the like
      const like = await LikePostare.create({
        id_postare,
        id_utilizator,
      })

      // Get the complete like with user info
      const completeLike = await LikePostare.findOne({
        where: {
          id_postare,
          id_utilizator,
        },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume"],
          },
        ],
      })

      res.status(201).json(completeLike)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteLike: async (req, res) => {
    try {
      const { id_postare } = req.body
      const id_utilizator = req.user.id

      // Check if the like exists
      const like = await LikePostare.findOne({
        where: {
          id_postare,
          id_utilizator,
        },
      })

      if (!like) {
        return res.status(404).json({ error: "Like not found" })
      }

      // Delete the like
      await like.destroy()

      res.json({ message: "Like removed" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

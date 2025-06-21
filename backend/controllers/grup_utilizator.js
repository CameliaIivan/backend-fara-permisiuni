const { GrupUtilizator, Grup, User } = require("../models")

module.exports = {
  // Get all members of a group
  getMembersByGroup: async (req, res) => {
    try {
      const grupId = req.params.grupId

      // Check if the group exists
      const grup = await Grup.findByPk(grupId)
      if (!grup) {
        return res.status(404).json({ error: "Grup not found" })
      }

      // Check if the group is private and the user is not a member
      if (grup.este_privata) {
        const isMember = await GrupUtilizator.findOne({
          where: {
            id_grup: grupId,
            id_utilizator: req.user.id,
          },
        })

        if (!isMember && grup.creat_de !== req.user.id && req.user.rol !== "admin") {
          return res.status(403).json({ error: "This is a private group" })
        }
      }

      // Get all members with their roles
      const members = await GrupUtilizator.findAll({
        where: { id_grup: grupId },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume", "email"],
          },
        ],
      })

      res.json(members)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Get all groups a user is a member of
  getGroupsByUser: async (req, res) => {
    try {
      const userId = req.params.userId || req.user.id

      // Check if the user exists
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      // Get all groups the user is a member of
      const groups = await GrupUtilizator.findAll({
        where: { id_utilizator: userId },
        include: [
          {
            model: Grup,
            include: [
              {
                model: User,
                as: "creator",
                attributes: ["id_utilizator", "nume"],
              },
            ],
          },
        ],
      })

      res.json(groups)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Add a user to a group
  addMember: async (req, res) => {
    try {
      const { id_grup, id_utilizator, rol_in_grup = "member" } = req.body
      const requestingUserId = req.user.id

      // Check if the group exists
      const grup = await Grup.findByPk(id_grup)
      if (!grup) {
        return res.status(404).json({ error: "Grup not found" })
      }

      // Check if the user exists
      const user = await User.findByPk(id_utilizator)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      // Check if the requesting user has permission to add members
      if (requestingUserId !== grup.creat_de && req.user.rol !== "admin") {
        const requesterMembership = await GrupUtilizator.findOne({
          where: {
            id_grup,
            id_utilizator: requestingUserId,
            rol_in_grup: "admin",
          },
        })

        if (!requesterMembership) {
          return res.status(403).json({ error: "Only group admins can add members" })
        }
      }

      // Check if the user is already a member
      const existingMembership = await GrupUtilizator.findOne({
        where: {
          id_grup,
          id_utilizator,
        },
      })

      if (existingMembership) {
        return res.status(400).json({ error: "User is already a member of this group" })
      }

      // Add the user to the group
      const membership = await GrupUtilizator.create({
        id_grup,
        id_utilizator,
        rol_in_grup,
      })

      res.status(201).json(membership)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

   // Allow the current user to join a group
  joinGroup: async (req, res) => {
    
    // const { id_grup } = req.body
    // const id_utilizator = req.user.id

    // if (!grupId || !userId) {
    //     return res.status(400).json({ error: "Missing grupId or userId" });
    // }
    try {
      const { id_grup } = req.body
      const id_utilizator = req.user.id

      // Check if the group exists
      const grup = await Grup.findByPk(id_grup)
      if (!grup) {
        return res.status(404).json({ error: "Grup not found" })
      }

      // Private groups can only be joined by invitation (added by an admin)
      if (grup.este_privata) {
        return res.status(403).json({ error: "Cannot join a private group" })
      }

      // Check if the user is already a member
      const existingMembership = await GrupUtilizator.findOne({
        where: {
          id_grup,
          id_utilizator,
        },
      })

      if (existingMembership) {
        return res.status(400).json({ error: "User is already a member of this group" })
      }

      const membership = await GrupUtilizator.create({
        id_grup,
        id_utilizator,
        rol_in_grup: "member",
      })

      res.status(201).json(membership)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Remove a user from a group
  removeMember: async (req, res) => {
    try {
      const { id_grup, id_utilizator } = req.body
      const requestingUserId = req.user.id

      // Check if the group exists
      const grup = await Grup.findByPk(id_grup)
      if (!grup) {
        return res.status(404).json({ error: "Grup not found" })
      }

      // Check if the membership exists
      const membership = await GrupUtilizator.findOne({
        where: {
          id_grup,
          id_utilizator,
        },
      })

      if (!membership) {
        return res.status(404).json({ error: "Membership not found" })
      }

      // Check if the requesting user has permission to remove members
      if (requestingUserId !== id_utilizator && requestingUserId !== grup.creat_de && req.user.rol !== "admin") {
        const requesterMembership = await GrupUtilizator.findOne({
          where: {
            id_grup,
            id_utilizator: requestingUserId,
            rol_in_grup: "admin",
          },
        })

        if (!requesterMembership) {
          return res.status(403).json({ error: "Only group admins can remove members" })
        }
      }

      // Remove the user from the group
      await membership.destroy()

      res.json({ message: "Member removed from group" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Update a user's role in a group
  updateMemberRole: async (req, res) => {
    try {
      const { id_grup, id_utilizator, rol_in_grup } = req.body
      const requestingUserId = req.user.id

      // Check if the membership exists
      const membership = await GrupUtilizator.findOne({
        where: {
          id_grup,
          id_utilizator,
        },
      })

      if (!membership) {
        return res.status(404).json({ error: "Membership not found" })
      }

      // Check if the requesting user has permission to update roles
      const grup = await Grup.findByPk(id_grup)
      if (requestingUserId !== grup.creat_de && req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only group creators or admins can update roles" })
      }

      // Update the role
      await membership.update({ rol_in_grup })

      res.json(membership)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

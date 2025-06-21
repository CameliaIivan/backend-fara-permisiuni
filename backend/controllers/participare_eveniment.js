const { ParticipareEveniment, Eveniment, User, Postare } = require("../models")

module.exports = {
  // Get all participants for an event
  getParticipantsByEvent: async (req, res) => {
    try {
      const evenimentId = req.params.evenimentId

      // Check if the event exists
      const eveniment = await Eveniment.findByPk(evenimentId)
      if (!eveniment) {
        return res.status(404).json({ error: "Eveniment not found" })
      }

      // Get all participants
      const participants = await ParticipareEveniment.findAll({
        where: { id_eveniment: evenimentId },
        include: [
          {
            model: User,
            attributes: ["id_utilizator", "nume", "email"],
          },
        ],
      })

      res.json(participants)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Get all events a user is participating in
  getEventsByUser: async (req, res) => {
    try {
      const userId = req.params.userId || req.user.id

      // Check if the user exists
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      // Get all events the user is participating in
      const events = await ParticipareEveniment.findAll({
        where: { id_utilizator: userId },
        include: [
          {
            model: Eveniment,
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
          },
        ],
      })

      res.json(events)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Join an event
  joinEvent: async (req, res) => {
    try {
      const { id_eveniment } = req.body
      const id_utilizator = req.user.id

      // Check if the event exists
      const eveniment = await Eveniment.findByPk(id_eveniment)
      if (!eveniment) {
        return res.status(404).json({ error: "Eveniment not found" })
      }

      // Check if the user is already participating
      const existingParticipation = await ParticipareEveniment.findOne({
        where: {
          id_eveniment,
          id_utilizator,
        },
      })

      if (existingParticipation) {
        return res.status(400).json({ error: "User is already participating in this event" })
      }

      // Check if the event has reached maximum participants
      if (eveniment.nr_maxim_participanti) {
        const participantsCount = await ParticipareEveniment.count({
          where: { id_eveniment },
        })

        if (participantsCount >= eveniment.nr_maxim_participanti) {
          return res.status(400).json({ error: "Event has reached maximum participants" })
        }
      }

      // Create the participation
      const participation = await ParticipareEveniment.create({
        id_eveniment,
        id_utilizator,
      })

      res.status(201).json(participation)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Leave an event
  leaveEvent: async (req, res) => {
    try {
      const { id_eveniment } = req.body
      const id_utilizator = req.user.id

      // Check if the participation exists
      const participation = await ParticipareEveniment.findOne({
        where: {
          id_eveniment,
          id_utilizator,
        },
      })

      if (!participation) {
        return res.status(404).json({ error: "Participation not found" })
      }

      // Delete the participation
      await participation.destroy()

      res.json({ message: "Left event successfully" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

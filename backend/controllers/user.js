const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User } = require("../models")
const { Op } = require("sequelize")
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

module.exports = {
  // Caută utilizatori după nume
  searchUsers: async (req, res) => {
    try {
      const q = req.query.q || ""
      const users = await User.findAll({
        where: {
          nume: { [Op.like]: `%${q}%` },
        },
        attributes: ["id_utilizator", "nume"],
        limit: 10,
      })
      res.json(users)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  // Obține toți utilizatorii
  getAll: async (req, res) => {
    try {
      const users = await User.findAll()
      res.json(users)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
  
  // Returnează utilizatorii cu rol de administrator
  getAdmins: async (req, res) => {
    try {
      const admins = await User.findAll({
        where: { rol: "admin" },
        attributes: ["id_utilizator", "nume"],
      })
      res.json(admins)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Obține un utilizator după ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.status(404).json({ error: "User not found" })
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Creează un nou utilizator (hash-uind parola)
  addUser: async (req, res) => {
    try {
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can create users" })
      }
      const { nume, email, parola, rol } = req.body
      const hashedPassword = await bcrypt.hash(parola, 10)
      const newUser = await User.create({
        nume,
        email,
        parola_hash: hashedPassword,
        rol: rol || "basic",
      })
      res.status(201).json(newUser)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Actualizează un utilizator
  editUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.status(404).json({ error: "User not found" })
      if (req.user.rol !== "admin" && req.user.id !== user.id_utilizator) {
        return res.status(403).json({ error: "Unauthorized" })
      }
      if (req.body.parola) {
        req.body.parola_hash = await bcrypt.hash(req.body.parola, 10)
        delete req.body.parola
      }
      await user.update(req.body)
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Șterge un utilizator
  deleteUser: async (req, res) => {
    try {
      if (req.user.rol !== "admin") {
        return res.status(403).json({ error: "Only administrators can delete users" })
      }
      const user = await User.findByPk(req.params.id)
      if (!user) return res.status(404).json({ error: "User not found" })
      await user.destroy()
      res.json({ message: "User deleted" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // // Metodă de login pentru autentificare clasică
  // login: async (email, password) => {
  //   const user = await User.findOne({ where: { email } })
  //   if (!user) return null
  //   const valid = await bcrypt.compare(password, user.parola_hash)
  //   if (!valid) return null
  //   return user
  // },

  // // Actualizează ultima autentificare a utilizatorului
  // updateLastLogin: async (userId) => {
  //   const user = await User.findByPk(userId)
  //   if (user) {
  //     user.update({ ultima_autentificare: new Date() })
  //   }
  // },
}

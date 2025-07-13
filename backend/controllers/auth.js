const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User } = require("../models")
const JWT_SECRET = process.env.JWT_SECRET || "licenta"

module.exports = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { nume, email, parola } = req.body

      // Validare date
      if (!nume || !email || !parola) {
        return res.status(400).json({ error: "Toate câmpurile sunt obligatorii" })
      }

      if (parola.length < 6) {
        return res.status(400).json({ error: "Parola trebuie să aibă cel puțin 6 caractere" })
      }

      // Verifică dacă email-ul este valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Adresa de email nu este validă" })
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(parola, 10)

      // Create new user
      const newUser = await User.create({
        nume,
        email,
        parola_hash: hashedPassword,
        rol : "basic" // default role
      })

      // Generate JWT token
      const token = jwt.sign(
        {
          id: newUser.id_utilizator,
          rol: newUser.rol,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      )

      // Return user info and token
      res.status(201).json({
        user: {
          id: newUser.id_utilizator,
          nume: newUser.nume,
          email: newUser.email,
          rol: newUser.rol,
          poza_profil: newUser.poza_profil,
        },
        token,
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ error: "A apărut o eroare la înregistrare" })
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, parola } = req.body

      // Validare date
      if (!email || !parola) {
        return res.status(400).json({ error: "Email și parola sunt obligatorii" })
      }

      // Find user by email
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(parola, user.parola_hash)
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      // Verifică dacă contul este activ
      if (user.stare_cont !== "activ") {
        return res.status(403).json({ error: "Contul tău este " + user.stare_cont })
      }

      // Update last login
      await user.update({ ultima_autentificare: new Date() })

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id_utilizator,
          rol: user.rol,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      )

      // Return user info and token
      res.json({
        user: {
          id: user.id_utilizator,
          nume: user.nume,
          email: user.email,
          rol: user.rol,
          poza_profil: user.poza_profil,
        },
        token,
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ error: "A apărut o eroare la autentificare" })
    }
  },

  // Get current user info
  getCurrentUser: async (req, res) => {
    try {
      const userId = req.user.id
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["parola_hash"] },
      })

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      res.json(user)
    } catch (error) {
      console.error("Get current user error:", error)
      res.status(500).json({ error: "A apărut o eroare la obținerea datelor utilizatorului" })
    }
  },

  // Check if token is valid
  verifyToken: (req, res) => {
    res.json({ valid: true, user: req.user })
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const userId = req.user.id
      const { currentPassword, newPassword } = req.body

      // Validare date
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Ambele parole sunt obligatorii" })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Noua parolă trebuie să aibă cel puțin 6 caractere" })
      }

      // Găsește utilizatorul
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: "Utilizator negăsit" })
      }

      // Verifică parola curentă
      const isPasswordValid = await bcrypt.compare(currentPassword, user.parola_hash)
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Parola curentă este incorectă" })
      }

      // Hash noua parolă
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Actualizează parola
      await user.update({ parola_hash: hashedPassword })

      res.json({ message: "Parola a fost schimbată cu succes" })
    } catch (error) {
      console.error("Change password error:", error)
      res.status(500).json({ error: "A apărut o eroare la schimbarea parolei" })
    }
  },
}

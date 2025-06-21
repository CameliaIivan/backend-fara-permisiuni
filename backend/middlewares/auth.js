const jwt = require("jsonwebtoken")
const { User } = require("../models")

// Obține secretul JWT din variabilele de mediu
const JWT_SECRET = process.env.JWT_SECRET || "licenta"

/**
 * Middleware pentru verificarea autentificării
 */
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: No token provided" })
  }

  // Presupunem că token-ul este în formatul "Bearer <token>"
  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token malformatted" })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    // Verifică dacă utilizatorul există în baza de date
    User.findByPk(decoded.id)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "Unauthorized: User not found" })
        }

        // Atașează informațiile utilizatorului la request
        req.user = {
          id: user.id_utilizator,
          rol: user.rol,
          nume: user.nume,
          email: user.email,
        }

        next()
      })
      .catch((err) => {
        console.error("Error verifying user:", err)
        return res.status(500).json({ error: "Internal server error" })
      })
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" })
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" })
  }
}

/**
 * Middleware pentru verificarea rolului de admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user found" })
  }

  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" })
  }

  next()
}

/**
 * Middleware pentru verificarea rolului premium sau admin
 */
const isPremiumOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user found" })
  }

  if (req.user.rol !== "premium" && req.user.rol !== "admin") {
    return res.status(403).json({ error: "Forbidden: Premium or Admin access required" })
  }

  next()
}
/**
 * Middleware generic pentru verificarea rolurilor permise
 * @param {...string} roles - rolurile care pot accesa ruta
 */
const permit = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user found" })
  }

  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ error: "Forbidden: Access denied" })
  }

  next()
}

module.exports = {
  isAuthenticated,
  isAdmin,
  isPremiumOrAdmin,
  permit,
}

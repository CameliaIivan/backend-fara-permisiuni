const express = require("express")
const router = express.Router()
const authController = require("../controllers").authController
const { validate, schemas } = require("../middlewares/validator")
const { isAuthenticated } = require("../middlewares/auth")

// AM SCOS VALIDARILE CA SA VAD DACA MERGE

// Ruta de înregistrare cu validare
//router.post("/register", validate(schemas.register), authController.register)
router.post("/register", authController.register)


// Ruta de login cu validare
// router.post("/login", validate(schemas.login), authController.login)
router.post("/login", authController.login)

// Ruta de logout
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful. Please delete your token on client side." })
})

// Ruta pentru obținerea informațiilor utilizatorului curent
router.get("/me", isAuthenticated, authController.getCurrentUser)

// Ruta pentru verificarea validității token-ului
router.get("/verify", isAuthenticated, authController.verifyToken)

// Ruta pentru schimbarea parolei
// router.post("/change-password", isAuthenticated, validate(schemas.changePassword), authController.changePassword)
router.post("/change-password", isAuthenticated, authController.changePassword)


module.exports = router

const express = require("express")
const router = express.Router()

const grupUtilizatorController = require("../controllers").grupUtilizatorController
const auth = require("../middlewares/auth")

// Adaugă un utilizator într-un grup (de obicei, user-ul care dorește să adere sau se invită automat dintr-un proces de admin)
router.post("/add", auth.isAuthenticated, grupUtilizatorController.addMember)
// Obține toți utilizatorii dintr-un grup
router.get("/getAll/:grupId", auth.isAuthenticated, grupUtilizatorController.getMembersByGroup)
// Obține toate grupurile la care este membru un utilizator
router.get("/userGroups/:userId", auth.isAuthenticated, grupUtilizatorController.getGroupsByUser)
router.post("/join", auth.isAuthenticated, grupUtilizatorController.joinGroup)
// Elimină un utilizator din grup
router.delete("/remove", auth.isAuthenticated, grupUtilizatorController.removeMember)
router.delete("/leave", auth.isAuthenticated, grupUtilizatorController.leaveGroup)

module.exports = router

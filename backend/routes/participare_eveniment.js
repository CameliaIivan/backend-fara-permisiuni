const express = require("express")
const router = express.Router()

const participareEvenimentController = require("../controllers").participareEvenimentController
const auth = require("../middlewares/auth")

// Permite unui utilizator să se înscrie la un eveniment
router.post("/join", auth.isAuthenticated, participareEvenimentController.joinEvent)
// Permite unui utilizator să renunțe la un eveniment
router.delete("/leave", auth.isAuthenticated, participareEvenimentController.leaveEvent)
// Obține lista de participanți la un eveniment
router.get("/participants/:evenimentId", auth.isAuthenticated, participareEvenimentController.getParticipantsByEvent)
// Obține evenimentele la care este înscris un utilizator
router.get("/userEvents/:userId", auth.isAuthenticated, participareEvenimentController.getEventsByUser)

module.exports = router

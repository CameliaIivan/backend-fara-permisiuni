const express = require("express")
const router = express.Router()

const SpitalSpecializareController = require("../controllers").spitalSpecializareController
const auth = require("../middlewares/auth")


// Obține toate specializările pentru un spital
router.get("/getAll/:spitalId", auth.isAuthenticated, SpitalSpecializareController.getSpecializariBySpital)
// Adaugă o specializare la un spital
router.post("/add", auth.isAuthenticated, SpitalSpecializareController.addSpecializareToSpital)
// Elimină o specializare de la un spital
router.delete("/remove", auth.isAuthenticated, SpitalSpecializareController.removeSpecializareFromSpital)
// Obține toate spitalele pentru o specializare
router.get("/spitale/:specializareId", auth.isAuthenticated, SpitalSpecializareController.getSpitaleBySpecializare)

module.exports = router

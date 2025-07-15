const express = require("express")
const router = express.Router()

const grupController = require("../controllers").grupController
const auth = require("../middlewares/index")

router.get("/getAll", grupController.getAll)
router.get("/:id", auth.isAuthenticated, grupController.getGrupById)
router.post("/create", auth.isAuthenticated, grupController.createGrup)
router.put("/update/:id", auth.isAuthenticated, grupController.updateGrup)
router.delete("/delete/:id", auth.isAuthenticated, grupController.deleteGrup)

module.exports = router
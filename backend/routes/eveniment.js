const express = require("express")
const router = express.Router()

const evenimentController = require("../controllers").evenimentController
const auth = require("../middlewares/index")

router.get("/getAll", evenimentController.getAll)
router.get("/:id", auth.isAuthenticated, evenimentController.getEvenimentById)
router.get("/upcoming", evenimentController.getUpcomingEvents)
router.post("/create", auth.isAuthenticated, evenimentController.createEveniment)
router.put("/update/:id", auth.isAuthenticated, evenimentController.updateEveniment)
router.delete("/delete/:id", auth.isAuthenticated, evenimentController.deleteEveniment)

module.exports = router

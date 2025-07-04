const express = require("express")
const router = express.Router()

const evenimentController = require("../controllers/eveniment")
const auth = require("../middlewares/index")

router.get("/getAll", evenimentController.getAll)
router.get("/upcoming", evenimentController.getUpcomingEvents)
router.get("/:id", auth.isAuthenticated, evenimentController.getEvenimentById)
router.get("/pending", auth.isAuthenticated, auth.isAdmin, evenimentController.getPendingEvents)
router.post("/create", auth.isAuthenticated, evenimentController.createEveniment)
router.put("/update/:id", auth.isAuthenticated, evenimentController.updateEveniment)
router.delete("/delete/:id", auth.isAuthenticated, evenimentController.deleteEveniment)
router.put("/approve/:id", auth.isAuthenticated, auth.isAdmin, evenimentController.approveEveniment)
router.put("/reject/:id", auth.isAuthenticated, auth.isAdmin, evenimentController.rejectEveniment)
module.exports = router

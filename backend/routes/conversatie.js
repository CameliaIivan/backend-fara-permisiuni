const express = require("express")
const router = express.Router()

const conversatieController = require("../controllers").conversatieController
const auth = require("../middlewares/index")

router.get("/getAll", auth.isAuthenticated, conversatieController.getAll)
router.get("/:id", auth.isAuthenticated, conversatieController.getConversatieById)
router.post("/create", auth.isAuthenticated, conversatieController.createConversatie)
router.delete("/delete/:id", auth.isAuthenticated, conversatieController.deleteConversatie)

module.exports = router

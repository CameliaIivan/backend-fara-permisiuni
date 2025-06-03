const express = require("express")
const router = express.Router()

const faqController = require("../controllers").faqController
const auth = require("../middlewares/index")

router.get("/getAll", faqController.getAll)
router.get("/:id", auth.isAuthenticated, faqController.getFaqById)
router.post("/create", auth.isAuthenticated, faqController.createFaq) // Admin creează FAQ
router.put("/update/:id", auth.isAuthenticated, faqController.updateFaq)
router.delete("/delete/:id", auth.isAuthenticated, faqController.deleteFaq)

module.exports = router

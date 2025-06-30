const express = require("express")
const router = express.Router()

const faqController = require("../controllers").faqController
const auth = require("../middlewares/index")

router.get("/getAll", faqController.getAll)
router.get("/:id", faqController.getFaqById)
router.post(
  "/create",
  auth.isAuthenticated,
  auth.isAdmin,
  faqController.createFaq,
) // Admin creează FAQ
router.put(
  "/update/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  faqController.updateFaq,
)
router.delete(
  "/delete/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  faqController.deleteFaq,
)
module.exports = router

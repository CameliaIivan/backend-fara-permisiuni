const express = require("express")
const router = express.Router()

const specializareController = require("../controllers").specializareController
const auth = require("../middlewares/index")

router.get("/getAll", specializareController.getAll)
router.get("/:id", auth.isAuthenticated, specializareController.getSpecializareById)
router.post("/create", auth.isAuthenticated, specializareController.createSpecializare)
router.put("/update/:id", auth.isAuthenticated, specializareController.updateSpecializare)
router.delete("/delete/:id", auth.isAuthenticated, specializareController.deleteSpecializare)

module.exports = router

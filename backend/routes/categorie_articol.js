
const express = require("express")
const router = express.Router()

const categorieArticolController = require("../controllers").categorieArticolController
const auth = require("../middlewares/index")

router.get("/getAll", categorieArticolController.getAll)
router.get("/:id", auth.isAuthenticated, categorieArticolController.getCategorieById)
router.post("/create", auth.isAuthenticated, categorieArticolController.createCategorie)
router.put("/update/:id", auth.isAuthenticated, categorieArticolController.updateCategorie)
router.delete("/delete/:id", auth.isAuthenticated, categorieArticolController.deleteCategorie)

module.exports = router

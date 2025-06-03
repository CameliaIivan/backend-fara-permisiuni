const express = require("express")
const router = express.Router()

const spitalController = require("../controllers").spitalController
const auth = require("../middlewares/index")

// Pentru rutele care modifică datele din tabelul spital,
// este de preferat ca doar admin-ul să aibă acces, deci middleware-ul poate verifica acest aspect
router.get("/getAll", spitalController.getAll)
router.get("/:id", auth.isAuthenticated, spitalController.getSpitalById)
router.post("/create", auth.isAuthenticated, spitalController.createSpital)
router.put("/update/:id", auth.isAuthenticated, spitalController.updateSpital)
router.delete("/delete/:id", auth.isAuthenticated, spitalController.deleteSpital)

module.exports = router

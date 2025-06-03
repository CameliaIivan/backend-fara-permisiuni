const express = require("express")
const router = express.Router()

const mesajController = require("../controllers").mesajController
const auth = require("../middlewares/index")

router.get("/getAll", auth.isAuthenticated, mesajController.getAll)
router.get("/:id", auth.isAuthenticated, mesajController.getMesajById)
router.get("/conversatie/:id", auth.isAuthenticated, mesajController.getMesajeByConversatie)
router.post("/create", auth.isAuthenticated, mesajController.createMesaj)
router.put("/update/:id", auth.isAuthenticated, mesajController.updateMesaj)
router.delete("/delete/:id", auth.isAuthenticated, mesajController.deleteMesaj)

module.exports = router

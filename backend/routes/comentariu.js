const express = require("express")
const router = express.Router()

const comentariuController = require("../controllers").comentariuController
const auth = require("../middlewares/index")

router.get("/getAll", comentariuController.getAll)
router.get("/:id", auth.isAuthenticated, comentariuController.getComentariuById)
router.get("/postare/:postareId", auth.isAuthenticated, comentariuController.getComentariiByPostare) 
router.post("/create", auth.isAuthenticated, comentariuController.createComentariu)
router.put("/update/:id", auth.isAuthenticated, comentariuController.updateComentariu)
router.delete("/delete/:id", auth.isAuthenticated, comentariuController.deleteComentariu)

module.exports = router

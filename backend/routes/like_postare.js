const express = require("express")
const router = express.Router()

const likePostareController = require("../controllers").likePostareController
const auth = require("../middlewares/auth")

// Obține toate like-urile (de exemplu, pentru administrare)
router.get("/getAll", auth.isAuthenticated, likePostareController.getAll)
// Creează un like la o postare – de obicei, se folosește user-ul autentificat pentru identificare
router.post("/create", auth.isAuthenticated, likePostareController.createLike)
// Obține like-urile pentru o postare specifică
router.get("/postare/:postareId", auth.isAuthenticated, likePostareController.getLikesByPost)
// Șterge like-ul – de exemplu, pentru a retrage un like
router.delete("/delete", auth.isAuthenticated, likePostareController.deleteLike)

module.exports = router

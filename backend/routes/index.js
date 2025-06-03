const express = require("express")
const router = express.Router()

// Autentificare
router.use("/auth", require("./auth"))

// Rute pentru gestionarea utilizatorilor
router.use("/users", require("./user"))

// Rute pentru articolele din secțiunea informațională/legislativă
router.use("/articole", require("./articol"))
router.use("/categorie_articole", require("./categorie_articol"))
router.use("/faq", require("./faq"))

// Rute pentru spitale și specializări
router.use("/spitale", require("./spital"))
router.use("/specializari", require("./specializare"))
router.use('/spital_specializari', require('./spital_specializare'));

// Rute pentru platforma socială
router.use("/grupuri", require("./grup"))
router.use("/grup_utilizator", require("./grup_utilizator"))
router.use("/postari", require("./postare"))
router.use("/evenimente", require("./eveniment"))
router.use("/participare_evenimente", require("./participare_eveniment"))
router.use("/comentarii", require("./comentariu"))
router.use("/notificari", require("./notificare"))
router.use("/like_postari", require("./like_postare"))
router.use("/conversatii", require("./conversatie"))
router.use("/mesaje", require("./mesaj"))

module.exports = router

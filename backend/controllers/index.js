const userController = require("./user")
const articolController = require("./articol")
const categorieArticolController = require("./categorie_articol")
const spitalController = require("./spital")
const specializareController = require("./specializare")
const spitalSpecializareController = require("./spital_specializare")
const grupController = require("./grup")
const grupUtilizatorController = require("./grup_utilizator")
const postareController = require("./postare")
const evenimentController = require("./eveniment")
const participareEvenimentController = require("./participare_eveniment")
const comentariuController = require("./comentariu")
const notificareController = require("./notificare")
const likePostareController = require("./like_postare")
const conversatieController = require("./conversatie")
const mesajController = require("./mesaj")
const faqController = require("./faq")
const authController = require("./auth")

module.exports = {
  userController,
  articolController,
  categorieArticolController,
  spitalController,
  specializareController,
  spitalSpecializareController,
  grupController,
  grupUtilizatorController,
  postareController,
  evenimentController,
  participareEvenimentController,
  comentariuController,
  notificareController,
  likePostareController,
  conversatieController,
  mesajController,
  faqController,
  authController,
}

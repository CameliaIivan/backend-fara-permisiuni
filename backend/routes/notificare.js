const express = require("express")
const router = express.Router()

const notificareController = require("../controllers").notificareController
const auth = require("../middlewares/index")
const { markAsRead } = require("../controllers/notificare")

router.get("/getAll", auth.isAuthenticated, notificareController.getAll)
router.get("/:id", auth.isAuthenticated, notificareController.getNotificareById)
router.post("/create", auth.isAuthenticated, notificareController.createNotificare)
router.put("/markAsRead/:id", auth.isAuthenticated, markAsRead)
router.put("/markAllAsRead", auth.isAuthenticated, notificareController.markAllAsRead)
router.put("/update/:id", auth.isAuthenticated, notificareController.updateNotificare)
router.delete("/delete/:id", auth.isAuthenticated, notificareController.deleteNotificare)

module.exports = router

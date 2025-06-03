const express = require("express")
const router = express.Router()

const postareController = require("../controllers").postareController
const auth = require("../middlewares/index")

router.get("/getAll", postareController.getAll)
router.get("/:id", auth.isAuthenticated, postareController.getPostareById)
router.post("/create", auth.isAuthenticated, postareController.createPostare)
router.put("/update/:id", auth.isAuthenticated, postareController.updatePostare)
router.delete("/delete/:id", auth.isAuthenticated, postareController.deletePostare)

module.exports = router

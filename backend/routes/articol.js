
const express = require("express")
const router = express.Router()

const articolController = require("../controllers").articolController
const auth = require("../middlewares/index")

router.get("/getAll", articolController.getAll)
// router.get("/:id", auth.isAuthenticated, articolController.getArticolById)
// router.post("/create", auth.isAuthenticated, articolController.createArticol) // Doar admin poate crea
// router.put("/update/:id", auth.isAuthenticated, articolController.updateArticol)
// router.delete("/delete/:id", auth.isAuthenticated, articolController.deleteArticol)
router.get("/:id", articolController.getArticolById)
router.post(
  "/create",
  auth.isAuthenticated,
  auth.isAdmin,
  articolController.createArticol,
)
router.put(
  "/update/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  articolController.updateArticol,
)
router.delete(
  "/delete/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  articolController.deleteArticol,
)


module.exports = router

// const express = require('express');
// const router = express.Router();
// const { isAuthenticated, permit } = require('../middlewares/index');
// const { getAll, getUserById, editUser, deleteUser } = require('../controllers').userController;

// router.get('/getAll',           isAuthenticated, permit('admin'),                   getAll);
// router.get('/:id',              isAuthenticated, permit('basic','premium','admin'), getUserById);
// router.put('/update/:id',       isAuthenticated, permit('basic','premium','admin'), editUser);
// router.delete('/delete/:id',    isAuthenticated, permit('admin'),                   deleteUser);

// module.exports = router;
const express = require("express")
const router = express.Router()

const userController = require("../controllers").userController
const auth = require("../middlewares/index")
router.get("/search", auth.isAuthenticated, userController.searchUsers)
router.get(
  "/getAll",
  auth.isAuthenticated,
  auth.isAdmin,
  userController.getAll,
)
router.get("/admins", auth.isAuthenticated, userController.getAdmins)
router.get("/:id", auth.isAuthenticated, userController.getUserById)
router.post(
  "/create",
  auth.isAuthenticated,
  auth.isAdmin,
  userController.addUser,
)
router.put("/update/:id", auth.isAuthenticated, userController.editUser)
router.delete(
  "/delete/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  userController.deleteUser,
)
module.exports = router

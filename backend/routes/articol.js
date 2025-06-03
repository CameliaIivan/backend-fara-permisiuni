// const express = require('express');
// const router = express.Router();
// const { isAuthenticated, permit } = require('../middlewares/index');
// const { getAll, getArticolById, createArticol, updateArticol, deleteArticol } = require('../controllers').articolController;

// router.get('/getAll', getAll);
// router.get('/:id',    isAuthenticated,                getArticolById);
// router.post('/create', isAuthenticated, permit('admin'), createArticol);
// router.put('/update/:id', isAuthenticated, permit('admin'), updateArticol);
// router.delete('/delete/:id', isAuthenticated, permit('admin'), deleteArticol);

// module.exports = router;

const express = require("express")
const router = express.Router()

const articolController = require("../controllers").articolController
const auth = require("../middlewares/index")

router.get("/getAll", articolController.getAll)
router.get("/:id", auth.isAuthenticated, articolController.getArticolById)
router.post("/create", auth.isAuthenticated, articolController.createArticol) // Doar admin poate crea
router.put("/update/:id", auth.isAuthenticated, articolController.updateArticol)
router.delete("/delete/:id", auth.isAuthenticated, articolController.deleteArticol)

module.exports = router

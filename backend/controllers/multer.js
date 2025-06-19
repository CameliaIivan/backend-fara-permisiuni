const multer = require("multer")

//e necesar asta? sau ce e? ca sa se salveze poze?
// Multer is a middleware for handling `multipart/form-data`, which is primarily used for uploading files.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/") // Specify the directory where files should be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname) // Generate a unique filename
  },
})

const upload = multer({ storage: storage })

module.exports = upload

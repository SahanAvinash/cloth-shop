
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const protectAdmin = require("../middleware/authMiddleware");
const { uploadImage } = require("../controllers/imageController");

// Admin-only Image Upload
router.post("/", protectAdmin, upload.single("image"), uploadImage);

module.exports = router;

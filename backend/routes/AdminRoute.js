
const express = require("express");
const router = express.Router();

const {
  loginAdmin,
} = require("../controllers/AdminController");

// Admin Login
router.post("/login", loginAdmin);

module.exports = router;

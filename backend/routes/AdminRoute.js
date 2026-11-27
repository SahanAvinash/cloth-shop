
const express = require("express");
const router = express.Router();

const {
  loginAdmin,
} = require("../controllers/AdminController");

// Common Login - Admin & Customer
router.post("/login", loginAdmin);

module.exports = router;

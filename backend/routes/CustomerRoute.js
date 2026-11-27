
const express = require("express");
const router = express.Router();

const {
  registerCustomer,
} = require("../controllers/CustomerController");

// Customer Registration
router.post("/register", registerCustomer);

module.exports = router;

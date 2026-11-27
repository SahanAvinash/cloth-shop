
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Customer = require("../models/Customer");

const protectAdmin = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account;

    if (decoded.role === "admin") {
      account = await Admin.findById(decoded.id).select("-password");
    } else if (decoded.role === "customer") {
      account = await Customer.findById(decoded.id).select("-password");
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Account not found",
      });
    }

    req.user = {
      id: account._id,
      name: account.name,
      email: account.email,
      role: decoded.role,
    };

    // Keep admin-specific access protection
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.admin = account;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protectAdmin;

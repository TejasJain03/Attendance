const express = require("express");
const authControllers = require("../controllers/authControllers"); // Adjust path as necessary
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/admin/login", catchAsync(authControllers.adminLogin));
router.get("/auth/me", authMiddleware, catchAsync(authControllers.userDetails));
router.get(
  "/admin/logout",
  catchAsync(authControllers.adminLogout)
);

module.exports = router;

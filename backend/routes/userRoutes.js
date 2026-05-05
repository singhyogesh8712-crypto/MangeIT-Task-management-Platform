const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Only logged-in users can fetch all users
router.get("/", authMiddleware, getAllUsers);

module.exports = router;

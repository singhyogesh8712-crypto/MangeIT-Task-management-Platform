const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const {
  createTask,
  getTasks,
  updateTaskStatus
} = require("../controllers/taskController");

// Create Task (Admin)
router.post("/", auth, isAdmin, createTask);

// Get Tasks (User / Project based)
router.get("/", auth, getTasks);

// Update Task Status
router.put("/:id", auth, updateTaskStatus);

module.exports = router;
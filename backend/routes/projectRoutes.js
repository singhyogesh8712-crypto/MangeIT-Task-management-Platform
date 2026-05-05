const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const {
  createProject,
  getProjects,
  addMember
} = require("../controllers/projectController");

// Create Project (Admin only)
router.post("/", auth, isAdmin, createProject);

// Get All Projects
router.get("/", auth, getProjects);

// Add member to project
router.put("/:id/add-member", auth, isAdmin, addMember);

module.exports = router;
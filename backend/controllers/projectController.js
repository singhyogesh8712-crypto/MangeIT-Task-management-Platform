const Project = require("../models/Project");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Project name required" });
    }

    const project = new Project({
      name,
      description,
      createdBy: req.user.id
    });

    await project.save();

    res.status(201).json(project);

  } catch (err) {
    res.status(500).json(err);
  }
};

// Get Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("members", "name email")
      .populate("createdBy", "name");

    res.json(projects);

  } catch (err) {
    res.status(500).json(err);
  }
};

// Add Member
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
    }

    await project.save();

    res.json(project);

  } catch (err) {
    res.status(500).json(err);
  }
};
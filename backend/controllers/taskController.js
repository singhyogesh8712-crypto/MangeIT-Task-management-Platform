const Task = require("../models/Task");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    if (!title || !assignedTo || !dueDate) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      dueDate
    });

    await task.save();

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json(err);
  }
};

// Get Tasks
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    let filter = {};

    // If member → only their tasks
    if (req.user.role === "Member") {
      filter.assignedTo = req.user.id;
    }

    // Optional project filter
    if (projectId) {
      filter.projectId = projectId;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "name");

    res.json(tasks);

  } catch (err) {
    res.status(500).json(err);
  }
};

// Update Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Todo", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Only assigned user or admin can update
    if (
      req.user.role !== "Admin" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    task.status = status;
    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json(err);
  }
};
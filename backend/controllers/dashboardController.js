const Task = require("../models/Task");

exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();

    let filter = {};

    if (req.user.role === "Member") {
      filter.assignedTo = req.user.id;
    }

    const tasks = await Task.find(filter);

    const total = tasks.length;

    const completed = tasks.filter(t => t.status === "Done").length;
    const pending = tasks.filter(t => t.status !== "Done").length;

    const overdue = tasks.filter(t =>
      t.status !== "Done" && new Date(t.dueDate) < now
    ).length;

    res.json({
      total,
      completed,
      pending,
      overdue
    });

  } catch (err) {
    res.status(500).json(err);
  }
};
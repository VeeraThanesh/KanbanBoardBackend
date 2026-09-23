const Task = require("../model/taskModel");
const History = require("../model/historyModel");

// Helper to create history entry
const createHistory = async (entityId, action, changes, performedBy, entityType = "Task") => {
  try {
    const history = new History({
      entityType,
      entityId,
      action,
      changes,
      performedBy,
    });
    await history.save();
  } catch (err) {
    console.error("Failed to save history:", err);
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, project, assignee, issueType, priority, deadline, estimation, description, status, order, actualDeadline, hold } = req.body;
    
    // Generate simple unique token
    const token = `TK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const task = new Task({
      title,
      project,
      assignee,
      issueType,
      priority,
      deadline,
      estimation,
      description,
      status,
      order,
      token,
      actualDeadline,
      hold
    });

    await task.save();

    // Log History
    await createHistory(task._id, "CREATE", task.toObject(), req.user.id);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    const query = {};
    if (projectId) query.project = projectId;

    const tasks = await Task.find(query)
      .populate("assignee", "userName email")
      .populate("project", "name")
      .sort({ order: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const oldTask = await Task.findById(id);
    if (!oldTask) return res.status(404).json({ message: "Task not found" });

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });

    // Calculate changes
    const changes = {};
    for (const key in updates) {
      if (oldTask[key]?.toString() !== updates[key]?.toString()) {
        changes[key] = { old: oldTask[key], new: updates[key] };
      }
    }

    if (Object.keys(changes).length > 0) {
      await createHistory(task._id, "UPDATE", changes, req.user.id);
    }
    
    // Check if assignee changed specifically for ASSIGN action logging if needed, 
    // but UPDATE covers it. could be explicit.

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    
    if (task) {
        await createHistory(task._id, "DELETE", { task: task.title }, req.user.id);
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, order } = req.body;

        const oldTask = await Task.findById(id);
        const task = await Task.findByIdAndUpdate(id, { status, order }, { new: true });

        const changes = {};
        if (oldTask.status !== status) changes.status = { old: oldTask.status, new: status };
        // We usually don't log every drag order change to history to avoid spam, unless status changes.
        
        if (Object.keys(changes).length > 0) {
            await createHistory(task._id, "UPDATE", changes, req.user.id);
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

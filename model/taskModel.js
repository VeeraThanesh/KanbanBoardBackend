const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kanbanUser",
    },
    issueType: {
      type: String,
      enum: ["Bug", "Task", "Story"],
      default: "Task",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    deadline: {
      type: Date,
    },
    actualDeadline: {
      type: Date,
    },
    estimation: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ToDo", "Inprogress", "QA", "Production"],
      default: "ToDo",
    },
    hold: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      unique: true,
    },
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    workLogs: [
      {
        assignee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "kanbanUser",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        startTime: String,
        endTime: String,
        duration: String,
        description: String,
      },
    ],
    bugs: [
      {
        assignee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "kanbanUser",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        description: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);

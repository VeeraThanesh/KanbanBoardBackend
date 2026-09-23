const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["Task", "Project"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "entityType",
    },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "ASSIGN"],
      required: true,
    },
    changes: {
      type: Object, // Stores { field: { old: val, new: val } }
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kanbanUser",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", HistorySchema);

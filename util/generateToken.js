const CounterModel = require("../model/counterModel");

// Map issueType → prefix
const ISSUE_PREFIX_MAP = {
  task: "TK",
  bug: "BG",
  story: "SY",
};

const generateToken = async (issueType) => {
  const prefix = ISSUE_PREFIX_MAP[issueType.toLowerCase()];

  if (!prefix) {
    throw new Error("Invalid issue type");
  }

  // Atomic increment
  const counter = await CounterModel.findOneAndUpdate(
    { issueType },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedNumber = String(counter.seq).padStart(3, "0");

  return `${prefix}${paddedNumber}`;
};

module.exports = generateToken;

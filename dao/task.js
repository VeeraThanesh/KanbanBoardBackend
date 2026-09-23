const mongoose = require("mongoose");
const taskModel = require("../model/taskModel");
const generateToken = require("../util/generateToken");
const historyDao = require("./history");

const calculateChanges = (oldData, newData) => {
  const changes = {};
  const fields = ["title", "description", "status", "priority", "assignee", "project", "deadline", "estimation", "issueType", "actualDeadline", "hold", "bugs"];
  fields.forEach(field => {
    if (newData[field] !== undefined) {
        let oldVal = oldData[field];
        let newVal = newData[field];
        
        if (oldVal && oldVal._id) oldVal = oldVal._id.toString();
        else if (oldVal && typeof oldVal === 'object' && oldVal.toString) oldVal = oldVal.toString();

        if (newVal && newVal._id) newVal = newVal._id.toString();
        else if (newVal && typeof newVal === 'object' && newVal.toString) newVal = newVal.toString();

        if (oldVal != newVal) {
           changes[field] = { old: oldData[field], new: newData[field] };
        }
    }
  });
  return changes;
};

module.exports.createTask = async (receivedData, userId, callback) => {
  try {
    let isExists = await taskModel.findOne({
      title: receivedData.title,
      project: receivedData.project,
      isActive: true,
    });

    if (isExists) {
      return callback(null, {
        error: true,
        statusCode: 409,
        message: "Task Title Already Exists",
      });
    }

    const token = await generateToken(receivedData.issueType);
    const result = await taskModel.create({ ...receivedData, token });

    // Record History
    await historyDao.createHistory({
      entityType: "Task",
      entityId: result._id,
      action: "CREATE",
      performedBy: userId,
    });

    callback(null, {
      error: false,
      data: result,
      message: "Task Created Successfully",
    });
  } catch (error) {
    console.log(error);
    callback(error);
  }
};

module.exports.getTask = async (query, callback) => {
  let { search, sort, page, limit, currentUser, sortType, ...rest } = query;
  
  // Remove empty strings, undefined, or null values from rest
  Object.keys(rest).forEach(key => {
    if (rest[key] === "" || rest[key] === undefined || rest[key] === null) {
      delete rest[key];
    }
  });

  let searchQuery = { isActive: true, ...rest };

  if (searchQuery.parentTask) searchQuery.parentTask = new mongoose.Types.ObjectId(searchQuery.parentTask);
  if (searchQuery.project) searchQuery.project = new mongoose.Types.ObjectId(searchQuery.project);
  if (searchQuery.assignee) searchQuery.assignee = new mongoose.Types.ObjectId(searchQuery.assignee);

  if (sort && sort !== "" && sort.includes("-")) {
    let data = sort.replace("-", "");
    sort = { [data]: -1 };
  } else {
    sort = { _id: 1 };
  }

  const escapeRegex = (string) => {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  if (search && search !== "") {
    const regex = new RegExp(escapeRegex(search), "i");
    searchQuery["title"] = regex;
  }

  if (currentUser && currentUser !== "") {
    searchQuery.assignee = new mongoose.Types.ObjectId(currentUser);
  }

  const currentPage = page !== undefined ? Number(page) || 1 : null;
  const itemsPerPage = limit !== undefined ? Number(limit) : null;
  const skip = (currentPage - 1) * (itemsPerPage || 0);

  let pipline = [{ $match: { ...searchQuery } }, { $sort: { ...sort } }];
  piplineWithPagination = [...pipline];
  if (itemsPerPage > 0) {
    piplineWithPagination.push({ $skip: skip }, { $limit: itemsPerPage });
  }
  try {
    const [data, totalCountRes] = await Promise.all([
      taskModel.aggregate(piplineWithPagination),
      taskModel.aggregate([...pipline, { $count: "totalCount" }]),
    ]);

    const totalDocument = totalCountRes[0] ? totalCountRes[0].totalCount : 0;

    callback(null, {
      error: false,
      data: data,
      message: "Retrived Successfully",
      totalCount: totalDocument,
    });
  } catch (error) {
    callback(error);
  }
};

module.exports.getTaskById = async (id, callback) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return callback(null, {
        error: true,
        statusCode: 400,
        message: "Invalid Task ID",
      });
    }

    const task = await taskModel
      .findOne({ _id: id, isActive: true })
      .populate("assignee")
      .populate("project")
      .populate("parentTask", "token title")
      .populate("workLogs.assignee", "userName email")
      .populate("bugs.assignee", "userName email");

    if (!task) {
      return callback(null, {
        error: true,
        statusCode: 404,
        message: "Task Not Found",
      });
    }

    return callback(null, {
      error: false,
      data: task,
      message: "Retrieved Successfully",
    });
  } catch (error) {
    return callback(error);
  }
};

module.exports.updateTask = async (id, receivedData, userId, callback) => {
  try {
    const oldTask = await taskModel.findById(id);
    if (!oldTask) {
      return callback(null, { error: true, message: "Task not found" });
    }

    const changes = calculateChanges(oldTask.toObject(), receivedData);

    const result = await taskModel.findByIdAndUpdate(id, receivedData, {
      new: true,
    });

    if (Object.keys(changes).length > 0) {
      await historyDao.createHistory({
        entityType: "Task",
        entityId: id,
        action: "UPDATE",
        changes: changes,
        performedBy: userId,
      });
    }

    callback(null, {
      error: false,
      data: result,
      message: "Updated Successfully",
    });
  } catch (error) {
    callback(error);
  }
};

module.exports.deleteTask = async (id, userId, callback) => {
  try {
    const result = await taskModel.findByIdAndDelete(id);

    if (result) {
      await historyDao.createHistory({
        entityType: "Task",
        entityId: id,
        action: "DELETE",
        performedBy: userId,
      });
    }

    callback(null, {
      error: false,
      data: result,
      message: "Deleted Successfully",
    });
  } catch (error) {
    callback(error);
  }
};

const service = require("../services/task");
const { failure, success } = require("../util/errorHandler");

module.exports.createTask = (req, res) => {
  const receivedData = req.body;
  const userId = req.user.id;
  service.createTask(receivedData, userId, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

module.exports.getTask = (req, res) => {
  const query = req.query;
  service.getTask(query, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

module.exports.getTaskById = (req, res) => {
  const { id } = req.params;
  service.getTaskById(id, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

module.exports.updateTask = (req, res) => {
  const receivedData = req.body;
  const { id } = req.params;
  const userId = req.user.id;
  service.updateTask(id, receivedData, userId, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

module.exports.updateTaskStatus = (req, res) => {
  const receivedData = req.body;
  const { id } = req.params;
  const userId = req.user.id;
  service.updateTask(id, receivedData, userId, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

module.exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  service.deleteTask(id, userId, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

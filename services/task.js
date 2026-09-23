const dao = require("../dao/task");

module.exports.createTask = (receivedData, userId, callback) => {
  dao.createTask(receivedData, userId, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

module.exports.getTask = (query, callback) => {
  dao.getTask(query, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

module.exports.getTaskById = (id, callback) => {
  dao.getTaskById(id, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

module.exports.updateTask = (id, receivedData, userId, callback) => {
  dao.updateTask(id, receivedData, userId, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

module.exports.deleteTask = (id, userId, callback) => {
  dao.deleteTask(id, userId, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

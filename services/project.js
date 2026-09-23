const dao = require("../dao/project");

exports.createProject = (data, callback) => {
  dao.createProject(data, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

exports.getProject = (query, callback) => {
  dao.getProject(query, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

exports.updateProject = (id, data, callback) => {
  dao.updateProject(id, data, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

exports.deleteProject = (id, callback) => {
  dao.deleteProject(id, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

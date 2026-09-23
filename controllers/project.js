const service = require("../services/project");
const { failure, success } = require("../util/errorHandler");

exports.createProject = (req, res) => {
  const receivedData = req.body;
  service.createProject(receivedData, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

exports.getProject = (req, res) => {
  const query = req.query;
  service.getProject(query, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

exports.updateProject = (req, res) => {
  const receivedData = req.body;
  const { id } = req.params;
  service.updateProject(id, receivedData, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

exports.deleteProject = (req, res) => {
  const { id } = req.params;
  service.deleteProject(id, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

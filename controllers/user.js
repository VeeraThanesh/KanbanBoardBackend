const service = require("../services/user");
const { failure, success } = require("../util/errorHandler");

module.exports.createUser = (req, res) => {
  const receivedData = req.body;
  service.createUser(receivedData, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

module.exports.getUser = (req, res) => {
  const query = req.query;
  service.getUser(query, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

module.exports.updateUser = (req, res) => {
  const receivedData = req.body;
  const { id } = req.params;
  service.updateUser(id, receivedData, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

module.exports.deleteUser = (req, res) => {
  const { id } = req.params;
  service.deleteUser(id, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

module.exports.loginAuth = (req, res) => {
  const receivedData = req.body;
  service.loginAuth(receivedData, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

const dao = require("../dao/user");

module.exports.createUser = (data, callback) => {
  dao.createUser(data, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

module.exports.getUser = (query, callback) => {
  dao.getUser(query, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

module.exports.updateUser = (id, data, callback) => {
  dao.updateUser(id, data, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

module.exports.deleteUser = (id, callback) => {
  dao.deleteUser(id, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

module.exports.loginAuth = (data, callback) => {
  dao.loginAuth(data, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

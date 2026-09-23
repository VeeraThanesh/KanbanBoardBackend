const dao = require("../dao/history");

exports.getHistory = (query, callback) => {
  dao.getHistory(query, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

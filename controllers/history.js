const { failure, success } = require("../util/errorHandler");
const service = require("../services/history");
// exports.getHistory = async (req, res) => {
//   try {
//     const { entityType, entityId } = req.query;
//     const query = {};
//     if (entityType) query.entityType = entityType;
//     if (entityId) query.entityId = entityId;

//     const history = await History.find(query)
//       .populate("performedBy", "userName email")
//       .populate("entityId", "title name token") // Populate title/token (Task) and name (Project)
//       .sort({ createdAt: -1 });
//     res.status(200).json(history);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getHistory = (req, res) => {
  const query = req.query;
  service.getHistory(query, function (err, data) {
    if (err) {
      return failure(err, res);
    } else {
      return success(data, res);
    }
  });
};

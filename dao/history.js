const mongoose = require("mongoose");
const historyModel = require("../model/historyModel");

exports.getHistory = async (query, callback) => {
  try {
    const pipeline = [];

    // Optional filters from query
    if (query.entityType) {
      pipeline.push({ $match: { entityType: query.entityType } });
    }

    if (query.entityId) {
      pipeline.push({
        $match: { entityId: new mongoose.Types.ObjectId(query.entityId) },
      });
    }

    if (query.action) {
      pipeline.push({ $match: { action: query.action } });
    }

    pipeline.push(
      {
        $lookup: {
          from: "tasks",
          localField: "entityId",
          foreignField: "_id",
          as: "taskData",
        },
      },
      {
        $unwind: {
          path: "$taskData",
          preserveNullAndEmptyArrays: true,
        },
      }
    );

    // Sort latest first
    pipeline.push({ $sort: { createdAt: -1 } });

    pipeline.push(
      {
        $lookup: {
          from: "kanbanUser",
          localField: "performedBy",
          foreignField: "_id",
          as: "performedBy",
        },
      },
      {
        $unwind: {
          path: "$performedBy",
          preserveNullAndEmptyArrays: true,
        },
      }
    );
    const [data, totalResult] = await Promise.all([
      historyModel.aggregate(pipeline),
      historyModel.aggregate([...pipeline, { $count: "totalCount" }]),
    ]);

    callback(null, {
      error: false,
      data,
      message: "Retrieved Successfully",
      totalCount: totalResult[0]?.totalCount || 0,
    });
  } catch (error) {
    callback(error);
  }
};

exports.createHistory = async (historyData) => {
  try {
    return await historyModel.create(historyData);
  } catch (error) {
    console.error("Error creating history:", error);
    throw error;
  }
};

const projectModel = require("../model/projectModel");

exports.createProject = async (data, callback) => {
  try {
    let isExits = await projectModel.findOne({
      name: data?.name,
      isActive: true,
    });

    if (isExits) {
      return callback(null, {
        error: true,
        statusCode: 409,
        message: "Project Name Already Exists",
      });
    }

    const result = await projectModel.create({ ...data });

    callback(null, {
      error: false,
      data: result,
      message: "Project Created Successfully",
    });
  } catch (error) {
    return callback(error);
  }
};

exports.getProject = async (query, callback) => {
  let searchQuery = { isActive: true };
  let { search, limit, page, sort } = query;

  if (sort?.includes("-")) {
    let data = sort.replace("-", "");
    sort = { [data]: -1 };
  } else {
    sort = { _id: 1 };
  }

  const escapeRegex = (string) => {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    searchQuery["$or"] = [{ userName: regex }];
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
    const [data, totalDocument] = await Promise.all([
      projectModel.aggregate(piplineWithPagination),
      projectModel
        .aggregate([...pipline, { $count: "totalCount" }])
        .then((res) => {
          return res[0] ? res[0].totalDocument : 0;
        }),
    ]);

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

exports.updateProject = async (id, data, callback) => {
  try {
    let isExists = await projectModel.findOne({
      name: data.name,
      isActive: true,
      _id: { $ne: id },
    });

    if (isExists) {
      return callback(null, {
        error: true,
        statusCode: 402,
        message: "Project Name Already Exists",
      });
    }

    projectModel
      .findOneAndUpdate({ _id: id, isActive: true }, { ...data }, { new: true })
      .then((result) =>
        callback(null, {
          error: false,
          data: result,
          message: "Project Update Successfully",
        })
      )
      .catch((error) => callback(error));
  } catch (error) {
    return callback(error);
  }
};

// exports.findByIdAndUpdate = async (id, data) => {
//   return await Project.findByIdAndUpdate(id, data, { new: true });
// };

exports.deleteProject = (id, callback) => {
  projectModel
    .findByIdAndUpdate(id, { isActive: false }, { new: true })
    .then((result) =>
      callback(null, {
        error: false,
        data: result,
        message: "Project Deleted Successfully",
      })
    )
    .catch((error) => callback(error));
};

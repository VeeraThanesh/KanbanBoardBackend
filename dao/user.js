const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

module.exports.createUser = async (data, callback) => {
  try {
    const isExists = await userModel.findOne({
      isActive: true,
      $or: [
        { userName: data?.userName },
        { email: data?.email }
      ],
    });

    if (isExists) {
      let message = "User already exists";

      if (isExists.userName === data.userName) {
        message = "UserName already exists";
      } else if (isExists.email === data.email) {
        message = "Email already exists";
      }

      return callback(null, {
        error: true,
        statusCode: 409,
        message,
      });
    }

    const result = await userModel.create({ ...data });

    return callback(null, {
      error: false,
      data: result,
      message: "User Created Successfully",
    });

  } catch (error) {
    console.log(error);
    return callback(error);
  }
};


module.exports.getUser = async (query, callback) => {
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
      userModel.aggregate(piplineWithPagination),
      userModel
        .aggregate([...pipline, { $count: "totalCount" }])
        .then((res) => {
          return res[0] ? res[0].totalCount : 0;
        }),
    ]);
    callback(null, {
      error: false,
      data: data,
      message: "Retrived Successfully",
      totalCount: totalDocument,
    });
  } catch (err) {
    callback(err);
  }
};

module.exports.updateUser = async (id, data, callback) => {
  let isExits = await userModel.findOne({
    userName: data.userName,
    isActive: true,
    _id: { $ne: id },
  });
  if (isExits) {
    return callback(null, {
      error: true,
      statusCode: 402,
      message: "User Already Exists",
    });
  }

  userModel
    .findOneAndUpdate({ _id: id, isActive: true }, { ...data }, { new: true })
    .then((result) =>
      callback(null, {
        error: false,
        data: result,
        message: "User Updated Successfully",
      })
    )
    .catch((err) => callback(err));
};

module.exports.deleteUser = (id, callback) => {
  userModel
    .findByIdAndUpdate(id, { isActive: false }, { new: true })
    .then((result) =>
      callback(null, {
        error: false,
        data: result,
        message: "User Deleted Successfully",
      })
    )
    .catch((err) => callback(err));
};

module.exports.loginAuth = async (data, callback) => {
  console.log(data, "DATA");
  try {
    let isExists = await userModel.findOne({
      $or: [{ email: data?.email }, { userName: data?.email }],
      password: data?.password,
    });

    if (!isExists) {
      return callback({
        statusCode: 404,
        error: true,
        message: "Invalid Credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: isExists._id, email: isExists.email }, // payload
      process.env.JWT_SECRET, // secret key (store in .env)
      { expiresIn: "1h" } // token expiry
    );

    return callback(null, {
      error: false,
      // data: isExists,
      data: { ...isExists._doc, token },
      message: "Login Successfully",
    });
  } catch (err) {
    console.log(err, "Login Error");
  }
};

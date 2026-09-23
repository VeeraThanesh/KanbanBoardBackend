const somethingWentWrong = "Something Went Wrong";

module.exports.failure = (received, res) => {
  let status = received?.statusCode ? received.statusCode : 500;
  return res.status(status).send({
    error: true,
    ...received,
    // message: process.env.NODE_ENV === 'production' ? received?.message ? received?.message : somethingWentWrong : ""
    message:
      received?.message ||
      (process.env.NODE_ENV === "production"
        ? received?.message
          ? received?.message
          : somethingWentWrong
        : ""),
  });
};

module.exports.success = (received, res) => {
  let status = received?.statusCode ? received.statusCode : 200;
  return res.status(status).send({
    error: false,
    ...received,
    message:
      received?.message ||
      (process.env.NODE_ENV === "production"
        ? received?.message
          ? received?.message
          : "Success"
        : ""),
  });
};

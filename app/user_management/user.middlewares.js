const attributes = ["name", "email", "password", "role"];

exports.verifyUserSignUp = (req, res, next) => {
  const missingFields = attributes.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: `Missing required field(s): ${missingFields.join(", ")}`,
    });
  }

  if (!["admin", "manager", "employee"].includes(req.body["role"]))
    return res.status(400).json({
      status: false,
      code: 400,
      message: "role can only be user, manager or admin",
    });

  next();
};

exports.verifyUserId = (req, res, next) => {
  const { userId } = req.query;

  if (!userId)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "userId is required" });

  next();
};

exports.verifySignIn = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "email & password required" });

  next();
};

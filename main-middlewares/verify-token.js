const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; // Extract the token part
  if (token == null) {
    return res
      .status(401)
      .json({ code: 401, status: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
    if (err) {
      return res.status(401).json({ code: 401, status: false, message: "Invalid token" });
    }

    req.role = data.role;
    next();
  });
};

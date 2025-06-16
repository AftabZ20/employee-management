const jwt = require("jsonwebtoken");

exports.generateToken = ({ id, role, email }) => {
  const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET_KEY);
  return token;
};

exports.getPagination = ({ page, limit }) => {
  // Pagination logic
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return { pageNumber, pageSize, startIndex, endIndex };
};

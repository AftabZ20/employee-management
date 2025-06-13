exports.checkAdminAccessibility = (req, res, next) => {
  if (req?.role != "admin")
    return res.status(403).json({
      code: 403,
      status: false,
      message: "You do not have permission to perform this action",
    });

  next();
};

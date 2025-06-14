exports.checkUserAccessibility = (req, res, next) => {
  const { userId } = req.query;
  if (req?.role != "admin" && userId != req.userId)
    return res.status(403).json({
      status: false,
      code: 403,
      message: "You do NOT have permission to perform this account",
    });

  next();
};

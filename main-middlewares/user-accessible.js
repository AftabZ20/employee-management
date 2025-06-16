exports.checkUserAccessibility = (req, res, next) => {
  const { id } = req.query;
  if (req?.role != "admin" && id != req.id)
    return res.status(403).json({
      status: false,
      code: 403,
      message: "You do NOT have permission to perform this account",
    });

  next();
};

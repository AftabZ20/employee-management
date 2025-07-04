const userService = require("./user.service");

exports.addUser = async (req, res) => {
  const userData = req.body;

  try {
    const user = await userService.createUser(userData);
    return res.status(user.code).json(user);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.getUserByID = async (req, res) => {
  const { id } = req.query;

  try {
    const user = await userService.findUserById({ id });
    return res.status(user.code).json(user);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.query;
  const userData = req.body;

  if (req?.role != "admin" && userData.role)
    return res.status(403).json({
      status: false,
      message: "Only ADMIN can change the role",
      code: 403,
    });
  if (userData.role) {
    if (!["admin", "employee", "manager"].includes(userData.role))
      return res.status(400).json({
        status: false,
        code: 400,
        message: "role can only be admin, employee or manager",
      });
  }

  try {
    const user = await userService.editUser({ id, userData });
    return res.status(user.code).json(user);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const signedIn = await userService.signIn({ email, password });
    return res.status(signedIn.code).json(signedIn);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.query;

  try {
    const user = await userService.deleteUser({ id });
    return res.status(user.code).json(user);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;

  try {
    const users = await userService.getUsers({ page, limit, role, search });
    return res.status(users.code).json(users);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

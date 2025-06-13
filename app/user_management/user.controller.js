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
  const { userId } = req.query;

  try {
    const user = await userService.findUserById({ userId });
    return res.status(user.code).json(user);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.editUser = async (req, res) => {
  const { userId } = req.query;
  const userData = req.body;

  try {
    const user = await userService.editUser({ userId, userData });
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

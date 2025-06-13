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

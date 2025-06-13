const { cache } = require("../../configs/cache-config");
const { generateToken } = require("../../utils");
const userModel = require("./user.model");
const bcrypt = require("bcrypt");

exports.createUser = async (userData) => {
  //first check if the email is already under use, if yes, then return error message
  const userExists = await this.findUserByEmail({ email: userData.email });
  if (userExists.status)
    return {
      code: 409,
      status: false,
      message: "User with this email already exists",
    };

  userData.password = await bcrypt.hash(userData.password, 10);

  const createdUser = await userModel.create(userData);

  return {
    code: 201,
    status: true,
    message: `${createdUser.role} created successfully`,
    user: createdUser,
    token: generateToken({
      userId: createdUser.userId,
      role: createdUser.role,
      email: createdUser.email,
    }),
  };
};

exports.findUserByEmail = async ({
  email,
  attributeList = ["userId", "name", "email", "role"],
}) => {
  const cacheKey = `user_email_${email}`;
  const cachedUser = cache.get(cacheKey);

  if (cachedUser) {
    console.log("USER FETCHED FROM CACHE");
    return {
      code: 200,
      status: true,
      message: "User found successfully",
      user: cachedUser,
    };
  }

  const projection = attributeList.join(" ");
  const userExists = await userModel
    .findOne({ email, isDeleted: false })
    .select(projection);

  if (!userExists) {
    return { code: 404, status: false, message: "User not found" };
  }

  cache.set(cacheKey, userExists);

  return {
    code: 200,
    status: true,
    message: "User found successfully",
    user: userExists,
  };
};

exports.findUserById = async ({
  userId,
  attributeList = ["userId", "name", "email", "role"],
}) => {
  const cacheKey = `user_id_:${userId}`;
  const cachedUser = cache.get(cacheKey);

  if (cachedUser) {
    console.log("USER FETCHED FROM CACHE");
    return {
      code: 200,
      status: true,
      message: "User found successfully",
      user: cachedUser,
    };
  }

  const projection = attributeList.join(" ");
  const userExists = await userModel
    .findOne({ userId, isDeleted: false })
    .select(projection);

  if (!userExists) {
    return { code: 404, status: false, message: "User not found" };
  }

  cache.set(cacheKey, userExists);

  return {
    code: 200,
    status: true,
    message: "User found successfully",
    user: userExists,
  };
};

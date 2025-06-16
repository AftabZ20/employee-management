const { cache } = require("../../configs/cache-config");
const { generateToken, getPagination } = require("../../utils");
const userModel = require("./user.model");
const bcrypt = require("bcrypt");
const { parsedUser } = require("../../sanitizers/user.sanitizers");

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

exports.signIn = async ({ email, password }) => {
  //check if the user exists
  const userFound = await userModel.findOne({ email });
  if (!userFound)
    return {
      code: 404,
      status: false,
      message: "User this email does not exist",
    };

  if (userFound.isDeleted == true)
    return {
      code: 404,
      status: false,
      message:
        "This account has been deleted, kindly contact admin for support",
    };

  //check if the provided password matches with the stored password
  const isPasswordValid = await bcrypt.compare(password, userFound.password);
  if (!isPasswordValid)
    return { code: 401, status: false, message: "Invalid Password provided" };

  const parsedData = parsedUser(userFound);

  const cacheKey = `user_id_:${userFound.id}`;
  cache.set(cacheKey, parsedData);

  return {
    code: 200,
    status: true,
    message: "signed in successfully",
    user: parsedData,
    token: generateToken({
      userId: userFound.id,
      role: userFound.role,
      email: userFound.email,
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
  id,
  attributeList = ["userId", "name", "email", "role"],
}) => {
  const cacheKey = `user_id_:${id}`;
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
    .findOne({ _id: id, isDeleted: false })
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

exports.editUser = async ({ id, userData }) => {
  // Step 1: Use findUserById to check if user exists
  const userFound = await this.findUserById({
    id,
  });

  if (!userFound.status) {
    return userFound;
  }

  // Step 2: Sanitize userData (e.g., prevent updating password/id/email)
  const protectedFields = ["password", "_id", "id"];
  protectedFields.forEach((field) => delete userData[field]);

  if (userData.email) {
    const emailExists = await this.findUserByEmail({ email: userData.email });
    if (emailExists.status)
      return {
        code: 409,
        status: false,
        message: "A user is already registered with this email",
      };
  }

  // Step 3: Perform the update
  const updatedUser = await userModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: userData },
    { new: true }
  );

  const cleanedUser = parsedUser(updatedUser);

  // Step 4: Update cache
  const cacheKey = `user_id_:${id}`;
  cache.set(cacheKey, cleanedUser);

  return {
    code: 200,
    status: true,
    message: "User updated successfully",
    user: cleanedUser,
  };
};

exports.deleteUser = async ({ id }) => {
  const userFound = await this.findUserById({
    id,
  });

  if (!userFound.status) {
    return userFound;
  }

  // Step 3: Perform the update
  setImmediate(async () => {
    try {
      await userModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
      );

      cache.del(`user_id_:${id}`);
      cache.del(`user_email_${userFound?.user?.email}`);
    } catch (error) {
      console.error("ERROR IN DELETING USER: ", error);
    }
  });

  return {
    code: 200,
    status: true,
    message: "User has been deleted",
  };
};

exports.getUsers = async ({ page, limit, role, search }) => {
  const { startIndex, pageNumber, pageSize } = getPagination({ page, limit });

  const filters = {
    isDeleted: false,
  };

  if (role) {
    filters.role = role;
  }

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await userModel
    .find(filters)
    .skip(startIndex)
    .limit(pageSize)
    .select("_id userId name email role createdAt");

  const totalUsers = await userModel.countDocuments(filters);

  return {
    code: 200,
    status: true,
    message: "Users fetched successfully",
    users,
    paginationData: {
      total: totalUsers,
      pageNumber: pageNumber,
      totalPages: Math.ceil(totalUsers / pageSize),
    },
  };
};

exports.parsedUser = (userObj) => ({
  userId: userObj?.userId,
  name: userObj?.name,
  email: userObj?.email,
  role: userObj?.role,
});

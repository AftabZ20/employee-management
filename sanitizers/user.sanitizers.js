exports.parsedUser = (userObj) => ({
  userId: userObj?.userId,
  _id: userObj["_id"],
  name: userObj?.name,
  email: userObj?.email,
  role: userObj?.role,
});

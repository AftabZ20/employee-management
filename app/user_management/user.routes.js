const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

const { authenticateToken } = require("../../main-middlewares/verify-token");
const {
  checkAdminAccessibility,
} = require("../../main-middlewares/admin-accessible");
const {
  checkUserAccessibility,
} = require("../../main-middlewares/user-accessible");

const userController = require("./user.controller");
const {
  verifyUserSignUp,
  verifyUserId,
  verifySignIn,
} = require("./user.middlewares");

router.post(
  "/add",
  authenticateToken,
  checkAdminAccessibility,
  verifyUserSignUp,
  userController.addUser
);
router.get("/userId/", verifyUserId, userController.getUserByID);
router.put(
  "/edit/userId",
  authenticateToken,
  checkUserAccessibility,
  verifyUserId,
  userController.editUser
);
router.post("/signIn", verifySignIn, userController.signIn);
router.delete(
  "/delete/userId",
  authenticateToken,
  checkUserAccessibility,
  verifyUserId,
  userController.deleteUser
);

router.get("/", userController.getUsers);

module.exports = router;

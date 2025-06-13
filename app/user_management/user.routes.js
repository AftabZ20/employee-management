const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

const verifyToken = require("../../main-middlewares/verify-token");
const verifyAdminAccess = require("../../main-middlewares/admin-accessible");

const userController = require("./user.controller");
const { verifyUserSignUp, verifyUserId } = require("./user.middlewares");

router.post("/add", verifyToken.authenticateToken, verifyAdminAccess.checkAccessibility, verifyUserSignUp, userController.addUser);
router.get("/userId/", verifyUserId, userController.getUserByID);

module.exports = router;

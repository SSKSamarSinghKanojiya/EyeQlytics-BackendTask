const express = require("express");

const {
  registerUser,
  loginUser,
  getUserDetails,
  updateUserDetails,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/All", getAllUsers);
router.get("/me", authenticateUser, getUserDetails);
router.put("/update", authenticateUser, updateUserDetails);
router.delete("/delete", authenticateUser, deleteUser);

module.exports = router;


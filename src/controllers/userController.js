const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a user with name, email, and password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal Server Error
 */

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Login a user with email and password to get a JWT token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User login successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyX2lkIiwiaWF0IjoxNjM3MzU0ODU0LCJleHBpcmVkX3N0ZCI6MTYzNzM1ODI4fQ._Gcc2PqFz8d3Vhylf_qQzG2ZGgmr9...
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }
    const payload = { userId: user._id };
    const secretkey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(payload, secretkey, { expiresIn });
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "User login successfully ", token });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    // console.log("Decoded User Data: ", req.user); // Debugging
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    // console.log("Get Detials ",user);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.status(StatusCodes.OK).json({ message: "Fetched User Details ", user });
  } catch (error) {
    // console.log(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true }
    );

    // if (!user) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ message: "User not found" });
    // }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByIdAndDelete(userId);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "User deleted successfully", user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users (excluding passwords). Admin access is typically required.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109ca"
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
// Get All User
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password field for security
    res.status(StatusCodes.OK).json({ success: true, users });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

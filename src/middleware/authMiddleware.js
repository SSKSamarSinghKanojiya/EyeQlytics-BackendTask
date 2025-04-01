const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied. No Token Provided or Invalid Format" });
  }

  try {
    const jwtToken = token.split(" ")[1];
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Token" });
  }
};
module.exports = authenticateUser;

// const jwt = require("jsonwebtoken");
// const { StatusCodes } = require("http-status-codes");

// const authenticateUser = async (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token || !token.startsWith("Bearer ")) {
//     return res
//       .status(StatusCodes.UNAUTHORIZED)
//       .json({ message: "Access Denied. No Token Provided or Invalid Format" });
//   }

//   try {
//     const jwtToken = token.split(" ")[1];
//     const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

//     if (!decoded.userId) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Token Payload" });
//     }

//     req.user = decoded; // Ensure decoded contains userId
//     next();
//   } catch (error) {
//     res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Token" });
//   }
// };

// module.exports = authenticateUser;

// const jwt = require("jsonwebtoken");
// const { StatusCodes } = require("http-status-codes");
// const User = require("../models/userModel");

// const authenticateUser = async (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token || !token.startsWith("Bearer ")) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access Denied. Invalid Token Format" });
//   }

//   const extractedToken = token.split(" ")[1];
  
//   try {
//     const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select("-password");
//     // console.log("Middleware User ",user);
    
//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Token Verification Error:", error);
//     res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Token" });
//   }
// };

// module.exports = authenticateUser;


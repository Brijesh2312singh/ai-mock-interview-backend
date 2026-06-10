const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  profile
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User Authentication APIs
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User Signup
 *     tags: [Auth]
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: User Profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get("/profile", authMiddleware, profile);


module.exports = router;
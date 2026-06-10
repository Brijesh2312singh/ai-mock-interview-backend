const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateRoadmap,
  getRoadmapHistory
} = require("../controllers/roadmapController");

/**
 * @swagger
 * tags:
 *   name: Roadmap
 *   description: Learning Roadmap APIs
 */

/**
 * @swagger
 * /api/roadmap/generate:
 *   post:
 *     summary: Generate Learning Roadmap
 *     tags: [Roadmap]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target_role
 *             properties:
 *               target_role:
 *                 type: string
 *                 example: Senior iOS Developer
 */
router.post("/generate", authMiddleware, generateRoadmap);

/**
 * @swagger
 * /api/roadmap/history:
 *   get:
 *     summary: Get Roadmap History
 *     tags: [Roadmap]
 *     security:
 *       - bearerAuth: []
 */
router.get("/history", authMiddleware, getRoadmapHistory);

module.exports = router;
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  analyzeSkillGap,
  getSkillGapHistory
} = require("../controllers/skillGapController");

/**
 * @swagger
 * tags:
 *   name: Skill Gap
 *   description: Skill Gap Analysis APIs
 */

/**
 * @swagger
 * /api/skill-gap/analyze:
 *   post:
 *     summary: Analyze Skill Gap
 *     tags: [Skill Gap]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resume_id
 *               - target_role
 *             properties:
 *               resume_id:
 *                 type: integer
 *                 example: 1
 *               target_role:
 *                 type: string
 *                 example: Senior iOS Developer
 */
router.post("/analyze", authMiddleware, analyzeSkillGap);

/**
 * @swagger
 * /api/skill-gap/history:
 *   get:
 *     summary: Get Skill Gap History
 *     tags: [Skill Gap]
 *     security:
 *       - bearerAuth: []
 */
router.get("/history", authMiddleware, getSkillGapHistory);

module.exports = router;
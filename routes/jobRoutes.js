const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  recommendJobs,
  getJobRecommendationHistory
} = require("../controllers/jobController");

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job Recommendation APIs
 */

/**
 * @swagger
 * /api/jobs/recommend:
 *   post:
 *     summary: Recommend Jobs Based on Resume
 *     tags: [Jobs]
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
 *             properties:
 *               resume_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Job recommendations generated successfully
 *       400:
 *         description: resume_id is required
 *       404:
 *         description: Resume not found
 */
router.post("/recommend", authMiddleware, recommendJobs);

/**
 * @swagger
 * /api/jobs/history:
 *   get:
 *     summary: Get Job Recommendation History
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job recommendation history fetched successfully
 */
router.get("/history", authMiddleware, getJobRecommendationHistory);

module.exports = router;
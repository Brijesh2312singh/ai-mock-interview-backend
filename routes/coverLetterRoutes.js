const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateCoverLetter,
  getCoverLetterHistory
} = require("../controllers/coverLetterController");

/**
 * @swagger
 * tags:
 *   name: Cover Letter
 *   description: AI Cover Letter APIs
 */

/**
 * @swagger
 * /api/cover-letter/generate:
 *   post:
 *     summary: Generate Cover Letter
 *     tags: [Cover Letter]
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
 *               - job_title
 *               - company
 *             properties:
 *               resume_id:
 *                 type: integer
 *                 example: 1
 *               job_title:
 *                 type: string
 *                 example: iOS Developer
 *               company:
 *                 type: string
 *                 example: Google
 *     responses:
 *       201:
 *         description: Cover letter generated successfully
 */
router.post("/generate", authMiddleware, generateCoverLetter);

/**
 * @swagger
 * /api/cover-letter/history:
 *   get:
 *     summary: Get Cover Letter History
 *     tags: [Cover Letter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cover letter history fetched successfully
 */
router.get("/history", authMiddleware, getCoverLetterHistory);

module.exports = router;
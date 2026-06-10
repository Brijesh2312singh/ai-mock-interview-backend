const express = require("express");
const router = express.Router();

const {
  createInterview,
  getInterviewHistory,
  getInterviewQuestions,
  submitAnswer,
  getInterviewResult,
  completeInterview,
  getInterviewDashboard,
  getInterviewReport,
  downloadInterviewReport
} = require("../controllers/interviewController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Interviews
 *   description: Mock Interview APIs
 */

/**
 * @swagger
 * /api/interviews/create:
 *   post:
 *     summary: Create Mock Interview
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - experience_level
 *               - interview_type
 *             properties:
 *               role:
 *                 type: string
 *                 example: iOS Developer
 *               experience_level:
 *                 type: string
 *                 example: 2 Years
 *               interview_type:
 *                 type: string
 *                 example: Technical
 *     responses:
 *       201:
 *         description: Mock interview created successfully
 */
router.post("/create", authMiddleware, createInterview);

/**
 * @swagger
 * /api/interviews/history:
 *   get:
 *     summary: Get Interview History
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interview history fetched successfully
 */
router.get("/history", authMiddleware, getInterviewHistory);

/**
 * @swagger
 * /api/interviews/dashboard:
 *   get:
 *     summary: Get Interview Dashboard
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard fetched successfully
 */
router.get("/dashboard", authMiddleware, getInterviewDashboard);

/**
 * @swagger
 * /api/interviews/answer:
 *   post:
 *     summary: Submit Interview Answer with AI Feedback
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interview_id
 *               - question_id
 *               - answer
 *             properties:
 *               interview_id:
 *                 type: integer
 *                 example: 1
 *               question_id:
 *                 type: integer
 *                 example: 2
 *               answer:
 *                 type: string
 *                 example: My strongest skills are Swift, UIKit, REST APIs, Google Maps and Node.js backend development.
 *     responses:
 *       201:
 *         description: Answer submitted successfully
 *       400:
 *         description: Required fields missing
 */
router.post("/answer", authMiddleware, submitAnswer);

/**
 * @swagger
 * /api/interviews/{id}/questions:
 *   get:
 *     summary: Get Interview Questions
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Interview questions fetched successfully
 *       404:
 *         description: Interview not found
 */
router.get("/:id/questions", authMiddleware, getInterviewQuestions);

/**
 * @swagger
 * /api/interviews/{id}/result:
 *   get:
 *     summary: Get Interview Result
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Interview result fetched successfully
 *       404:
 *         description: Interview not found
 */
router.get("/:id/result", authMiddleware, getInterviewResult);

/**
 * @swagger
 * /api/interviews/{id}/complete:
 *   put:
 *     summary: Complete Interview
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Interview completed successfully
 *       404:
 *         description: Interview not found
 */
router.put("/:id/complete", authMiddleware, completeInterview);
/**
 * @swagger
 * /api/interviews/{id}/report:
 *   get:
 *     summary: Get Interview Report
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Interview report fetched successfully
 *       404:
 *         description: Interview not found
 */
router.get("/:id/report", authMiddleware, getInterviewReport);
/**
 * @swagger
 * /api/interviews/{id}/report/pdf:
 *   get:
 *     summary: Download Interview Report PDF
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: PDF downloaded successfully
 */
router.get(
  "/:id/report/pdf",
  authMiddleware,
  downloadInterviewReport
);

module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadResume,
  analyzeResume,
  getResumeHistory,
  downloadResumeReportPDF
} = require("../controllers/resumeController");

const upload = multer({
  dest: "uploads/"
});

/**
 * @swagger
 * tags:
 *   name: Resume
 *   description: Resume ATS Analyzer APIs
 */

/**
 * @swagger
 * /api/resume/upload:
 *   post:
 *     summary: Upload Resume
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

/**
 * @swagger
 * /api/resume/analyze:
 *   post:
 *     summary: Analyze Resume
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 */
router.post("/analyze", authMiddleware, analyzeResume);

/**
 * @swagger
 * /api/resume/history:
 *   get:
 *     summary: Resume History
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 */
router.get("/history", authMiddleware, getResumeHistory);
/**
 * @swagger
 * /api/resume/{id}/report/pdf:
 *   get:
 *     summary: Download Resume ATS Report PDF
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: PDF downloaded successfully
 *       404:
 *         description: Resume report not found
 */
router.get("/:id/report/pdf", authMiddleware, downloadResumeReportPDF);

module.exports = router;
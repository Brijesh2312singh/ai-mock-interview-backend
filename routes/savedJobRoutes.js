const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  saveJob,
  getSavedJobs,
  deleteSavedJob
} = require("../controllers/savedJobController");

/**
 * @swagger
 * tags:
 *   name: Saved Jobs
 *   description: Saved Jobs APIs
 */

/**
 * @swagger
 * /api/jobs/save:
 *   post:
 *     summary: Save Job
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_title
 *             properties:
 *               job_title:
 *                 type: string
 *                 example: iOS Developer
 *               category:
 *                 type: string
 *                 example: Direct Match
 *               level:
 *                 type: string
 *                 example: Mid Level
 *               match_percentage:
 *                 type: integer
 *                 example: 92
 *               skills_required:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Swift", "UIKit", "REST APIs"]
 *               salary_range:
 *                 type: string
 *                 example: ₹4 LPA - ₹9 LPA
 *               description:
 *                 type: string
 *                 example: Build and maintain iOS applications.
 */
router.post("/save", authMiddleware, saveJob);

/**
 * @swagger
 * /api/jobs/saved:
 *   get:
 *     summary: Get Saved Jobs
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 */
router.get("/saved", authMiddleware, getSavedJobs);

/**
 * @swagger
 * /api/jobs/saved/{id}:
 *   delete:
 *     summary: Delete Saved Job
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 */
router.delete("/saved/:id", authMiddleware, deleteSavedJob);

module.exports = router;
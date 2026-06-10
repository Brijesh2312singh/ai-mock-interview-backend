const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  searchLiveJobs
} = require("../controllers/liveJobController");

/**
 * @swagger
 * tags:
 *   name: Live Jobs
 *   description: Live Jobs Search APIs
 */

/**
 * @swagger
 * /api/live-jobs/search:
 *   post:
 *     summary: Search Live Jobs
 *     tags: [Live Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyword
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: iOS Developer
 *               location:
 *                 type: string
 *                 example: Bangalore
 */
router.post("/search", authMiddleware, searchLiveJobs);

module.exports = router;
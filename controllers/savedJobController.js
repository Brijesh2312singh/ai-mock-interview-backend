const db = require("../config/mysqlDb");

const saveJob = (req, res) => {
  const userId = req.user.id;

  const {
    job_title,
    category,
    level,
    match_percentage,
    skills_required,
    salary_range,
    description
  } = req.body;

  if (!job_title) {
    return res.status(400).json({
      success: false,
      message: "job_title is required"
    });
  }

  db.query(
    `INSERT INTO saved_jobs
     (user_id, job_title, category, level, match_percentage, skills_required, salary_range, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      job_title,
      category || "",
      level || "",
      match_percentage || 0,
      JSON.stringify(skills_required || []),
      salary_range || "",
      description || ""
    ],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      return res.status(201).json({
        success: true,
        message: "Job saved successfully",
        saved_job_id: result.insertId
      });
    }
  );
};

const safeParseSkills = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch {
    return String(value)
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
  }
};

const getSavedJobs = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT * FROM saved_jobs WHERE user_id = ? ORDER BY id DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      const jobs = rows.map(job => ({
        ...job,
        skills_required: safeParseSkills(job.skills_required)
      }));

      return res.json({
        success: true,
        saved_jobs: jobs
      });
    }
  );
};

const deleteSavedJob = (req, res) => {
  const userId = req.user.id;
  const jobId = req.params.id;

  db.query(
    `DELETE FROM saved_jobs WHERE id = ? AND user_id = ?`,
    [jobId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Saved job not found"
        });
      }

      return res.json({
        success: true,
        message: "Saved job deleted successfully"
      });
    }
  );
};

module.exports = {
  saveJob,
  getSavedJobs,
  deleteSavedJob
};
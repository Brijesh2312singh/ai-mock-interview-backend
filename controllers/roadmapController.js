const db = require("../config/mysqlDb");

const buildRoadmap = (targetRole) => {
  const role = targetRole.toLowerCase();

  if (role.includes("ios")) {
    return [
      { month: 1, topics: ["Swift Advanced", "UIKit", "AutoLayout"] },
      { month: 2, topics: ["MVVM", "Core Data", "API Integration"] },
      { month: 3, topics: ["Firebase", "Unit Testing", "App Store Deployment"] }
    ];
  }

  if (role.includes("node")) {
    return [
      { month: 1, topics: ["Node.js", "Express.js", "REST APIs"] },
      { month: 2, topics: ["MySQL", "JWT Auth", "Swagger"] },
      { month: 3, topics: ["Deployment", "Caching", "System Design"] }
    ];
  }

  if (role.includes("react")) {
    return [
      { month: 1, topics: ["JavaScript", "React Basics", "Components"] },
      { month: 2, topics: ["Hooks", "Redux", "API Integration"] },
      { month: 3, topics: ["TypeScript", "Performance", "Deployment"] }
    ];
  }

  return [
    { month: 1, topics: ["Programming Basics", "Git", "REST APIs"] },
    { month: 2, topics: ["Database", "Authentication", "Projects"] },
    { month: 3, topics: ["Deployment", "Testing", "Interview Prep"] }
  ];
};

const generateRoadmap = (req, res) => {
  const userId = req.user.id;
  const { target_role } = req.body;

  if (!target_role) {
    return res.status(400).json({
      success: false,
      message: "target_role is required"
    });
  }

  const roadmap = buildRoadmap(target_role);

  db.query(
    `INSERT INTO learning_roadmaps (user_id, target_role, roadmap)
     VALUES (?, ?, ?)`,
    [userId, target_role, JSON.stringify(roadmap)],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      return res.status(201).json({
        success: true,
        message: "Learning roadmap generated successfully",
        roadmap: {
          id: result.insertId,
          target_role,
          roadmap
        }
      });
    }
  );
};

const getRoadmapHistory = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT * FROM learning_roadmaps WHERE user_id = ? ORDER BY id DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      const roadmaps = rows.map(item => ({
        ...item,
        roadmap: item.roadmap ? JSON.parse(item.roadmap) : []
      }));

      return res.json({
        success: true,
        roadmaps
      });
    }
  );
};

module.exports = {
  generateRoadmap,
  getRoadmapHistory
};
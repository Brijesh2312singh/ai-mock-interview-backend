const db = require("../config/mysqlDb");

const makeJob = (title, level, match, skills, salary, description, category) => ({
  title,
  category,
  level,
  match_percentage: match,
  skills_required: skills,
  salary_range: salary,
  description
});

const getRecommendedJobsByRole = (role, resumeText = "") => {
  const text = `${role} ${resumeText}`.toLowerCase();

  if (
    text.includes("ios") ||
    text.includes("swift") ||
    text.includes("uikit") ||
    text.includes("swiftui")
  ) {
    return {
      target_role: "iOS Developer",
      recommended_jobs: [
        makeJob("iOS Developer", "Mid Level", 92, ["Swift", "UIKit", "REST APIs", "Alamofire"], "₹4 LPA - ₹9 LPA", "Build and maintain iOS apps.", "Direct Match"),
        makeJob("Senior iOS Developer", "Senior", 86, ["Swift", "UIKit", "MVVM", "Core Data"], "₹8 LPA - ₹16 LPA", "Lead iOS feature development.", "Direct Match"),
        makeJob("Swift Developer", "Mid Level", 88, ["Swift", "Xcode", "API Integration"], "₹4 LPA - ₹10 LPA", "Develop Swift-based applications.", "Direct Match"),
        makeJob("Mobile App Developer", "Mid Level", 82, ["iOS", "Firebase", "Google Maps"], "₹5 LPA - ₹12 LPA", "Work on mobile app features.", "Direct Match"),

        makeJob("React Native Developer", "Mid Level", 76, ["React Native", "JavaScript", "Mobile UI"], "₹5 LPA - ₹12 LPA", "Build cross-platform mobile apps.", "Related Role"),
        makeJob("Flutter Developer", "Mid Level", 74, ["Flutter", "Dart", "Firebase"], "₹4 LPA - ₹11 LPA", "Develop Flutter mobile apps.", "Related Role"),
        makeJob("Backend Developer", "Mid Level", 68, ["Node.js", "MySQL", "REST APIs"], "₹5 LPA - ₹12 LPA", "Build backend services for apps.", "Related Role"),
        makeJob("Full Stack Developer", "Mid Level", 65, ["Frontend", "Backend", "Database"], "₹6 LPA - ₹14 LPA", "Work on frontend and backend modules.", "Related Role"),

        makeJob("Lead iOS Engineer", "Lead", 72, ["Architecture", "Swift", "Team Leadership"], "₹14 LPA - ₹25 LPA", "Lead iOS team and architecture.", "Growth Role"),
        makeJob("Mobile Team Lead", "Lead", 70, ["Mobile Architecture", "Team Management"], "₹15 LPA - ₹28 LPA", "Manage mobile app delivery.", "Growth Role"),
        makeJob("Technical Architect", "Senior", 62, ["System Design", "Architecture", "Scalability"], "₹18 LPA - ₹35 LPA", "Design app architecture.", "Growth Role"),
        makeJob("Engineering Manager", "Senior", 58, ["Leadership", "Planning", "Delivery"], "₹20 LPA - ₹40 LPA", "Lead engineering teams.", "Growth Role"),
        makeJob("Product Manager", "Senior", 55, ["Roadmap", "Analytics", "User Research"], "₹15 LPA - ₹35 LPA", "Manage mobile product strategy.", "Growth Role")
      ]
    };
  }

  if (text.includes("node") || text.includes("express") || text.includes("backend")) {
    return {
      target_role: "Node.js Developer",
      recommended_jobs: [
        makeJob("Node.js Developer", "Mid Level", 91, ["Node.js", "Express", "MySQL", "JWT"], "₹4 LPA - ₹10 LPA", "Build backend APIs.", "Direct Match"),
        makeJob("Backend Developer", "Mid Level", 88, ["REST APIs", "Database", "Authentication"], "₹5 LPA - ₹12 LPA", "Develop scalable backend systems.", "Direct Match"),
        makeJob("API Developer", "Mid Level", 84, ["Express", "Swagger", "Middleware"], "₹4 LPA - ₹9 LPA", "Create and maintain APIs.", "Direct Match"),
        makeJob("Senior Backend Engineer", "Senior", 78, ["System Design", "Caching", "Deployment"], "₹10 LPA - ₹22 LPA", "Design backend architecture.", "Growth Role")
      ]
    };
  }

  if (text.includes("python") || text.includes("django") || text.includes("flask")) {
    return {
      target_role: "Python Developer",
      recommended_jobs: [
        makeJob("Python Developer", "Mid Level", 90, ["Python", "Django", "Flask"], "₹4 LPA - ₹10 LPA", "Build Python apps.", "Direct Match"),
        makeJob("Django Developer", "Mid Level", 86, ["Django", "REST Framework", "PostgreSQL"], "₹5 LPA - ₹12 LPA", "Develop Django APIs.", "Direct Match"),
        makeJob("Automation Engineer", "Mid Level", 78, ["Python", "Scripting", "APIs"], "₹4 LPA - ₹9 LPA", "Automate workflows.", "Related Role"),
        makeJob("Backend Python Engineer", "Senior", 80, ["Python", "Microservices", "Cloud"], "₹8 LPA - ₹18 LPA", "Build backend services.", "Growth Role")
      ]
    };
  }

  if (text.includes("react") || text.includes("frontend") || text.includes("javascript") || text.includes("typescript")) {
    return {
      target_role: "React Developer",
      recommended_jobs: [
        makeJob("React Developer", "Mid Level", 90, ["React", "JavaScript", "REST APIs"], "₹4 LPA - ₹10 LPA", "Build React web apps.", "Direct Match"),
        makeJob("Frontend Developer", "Mid Level", 88, ["HTML", "CSS", "JavaScript"], "₹3 LPA - ₹9 LPA", "Develop UI screens.", "Direct Match"),
        makeJob("UI Engineer", "Mid Level", 82, ["React", "Responsive UI", "Figma"], "₹5 LPA - ₹12 LPA", "Create modern user interfaces.", "Related Role"),
        makeJob("Senior Frontend Engineer", "Senior", 78, ["React", "Redux", "Architecture"], "₹10 LPA - ₹20 LPA", "Lead frontend development.", "Growth Role")
      ]
    };
  }

  if (text.includes("data analyst") || text.includes("data") || text.includes("excel") || text.includes("power bi")) {
    return {
      target_role: "Data Analyst",
      recommended_jobs: [
        makeJob("Data Analyst", "Entry-Mid Level", 88, ["SQL", "Excel", "Power BI"], "₹3 LPA - ₹8 LPA", "Analyze business data.", "Direct Match"),
        makeJob("Business Analyst", "Mid Level", 82, ["Reporting", "Dashboards", "SQL"], "₹5 LPA - ₹12 LPA", "Prepare business insights.", "Related Role"),
        makeJob("Power BI Developer", "Mid Level", 80, ["Power BI", "DAX", "SQL"], "₹4 LPA - ₹10 LPA", "Build dashboards.", "Direct Match"),
        makeJob("Data Scientist", "Mid-Senior", 72, ["Python", "ML", "Statistics"], "₹8 LPA - ₹20 LPA", "Build data models.", "Growth Role")
      ]
    };
  }

  if (text.includes("sales") || text.includes("business development") || text.includes("bdm")) {
    return {
      target_role: "Sales Executive",
      recommended_jobs: [
        makeJob("Sales Executive", "Entry-Mid Level", 88, ["Communication", "Lead Generation", "CRM"], "₹2.5 LPA - ₹6 LPA", "Generate and close leads.", "Direct Match"),
        makeJob("Business Development Executive", "Mid Level", 84, ["Client Handling", "Sales Pitch", "Negotiation"], "₹3 LPA - ₹8 LPA", "Grow business relationships.", "Direct Match"),
        makeJob("Account Manager", "Mid Level", 78, ["Client Management", "Upselling", "Reporting"], "₹5 LPA - ₹12 LPA", "Manage client accounts.", "Related Role"),
        makeJob("Sales Manager", "Senior", 74, ["Team Handling", "Targets", "Strategy"], "₹8 LPA - ₹18 LPA", "Lead sales team.", "Growth Role")
      ]
    };
  }

  if (text.includes("seo") || text.includes("digital marketing") || text.includes("content marketing")) {
    return {
      target_role: "SEO Specialist",
      recommended_jobs: [
        makeJob("SEO Executive", "Entry-Mid Level", 88, ["On-page SEO", "Off-page SEO", "Keyword Research"], "₹2.5 LPA - ₹6 LPA", "Improve website ranking.", "Direct Match"),
        makeJob("SEO Specialist", "Mid Level", 84, ["Google Analytics", "Search Console", "Technical SEO"], "₹4 LPA - ₹9 LPA", "Manage SEO strategy.", "Direct Match"),
        makeJob("Digital Marketing Executive", "Mid Level", 80, ["SEO", "Social Media", "Ads"], "₹3 LPA - ₹8 LPA", "Run campaigns.", "Related Role"),
        makeJob("Content Strategist", "Mid Level", 74, ["Content Planning", "SEO Writing", "Analytics"], "₹4 LPA - ₹10 LPA", "Plan content growth.", "Growth Role")
      ]
    };
  }

  if (text.includes("manager") || text.includes("project manager") || text.includes("team lead")) {
    return {
      target_role: "Manager",
      recommended_jobs: [
        makeJob("Project Manager", "Senior", 84, ["Planning", "Team Management", "Agile"], "₹10 LPA - ₹22 LPA", "Manage project delivery.", "Direct Match"),
        makeJob("Product Manager", "Senior", 78, ["Roadmap", "User Research", "Analytics"], "₹12 LPA - ₹30 LPA", "Manage product strategy.", "Related Role"),
        makeJob("Team Lead", "Senior", 82, ["Leadership", "Code Review", "Delivery"], "₹9 LPA - ₹20 LPA", "Lead technical team.", "Direct Match"),
        makeJob("Operations Manager", "Senior", 76, ["Process", "Reporting", "Team Handling"], "₹8 LPA - ₹18 LPA", "Manage operations.", "Related Role")
      ]
    };
  }

  if (text.includes("hr") || text.includes("human resource") || text.includes("recruiter")) {
    return {
      target_role: "HR Executive",
      recommended_jobs: [
        makeJob("HR Executive", "Entry-Mid Level", 88, ["Recruitment", "Employee Relations", "HRMS"], "₹2.5 LPA - ₹6 LPA", "Handle HR operations.", "Direct Match"),
        makeJob("Technical Recruiter", "Mid Level", 84, ["Sourcing", "Screening", "Interview Coordination"], "₹3 LPA - ₹8 LPA", "Recruit technical candidates.", "Direct Match"),
        makeJob("HR Manager", "Senior", 76, ["Policy", "Payroll", "Team Management"], "₹8 LPA - ₹18 LPA", "Manage HR department.", "Growth Role"),
        makeJob("Talent Acquisition Specialist", "Mid Level", 82, ["Hiring", "LinkedIn", "Negotiation"], "₹4 LPA - ₹10 LPA", "Manage hiring pipeline.", "Related Role")
      ]
    };
  }

  return {
    target_role: "Software Developer",
    recommended_jobs: [
      makeJob("Software Engineer", "Entry-Mid Level", 75, ["Programming", "REST APIs", "SQL", "Git"], "₹3 LPA - ₹8 LPA", "Develop software applications.", "Direct Match"),
      makeJob("Application Developer", "Mid Level", 72, ["App Development", "Database", "API Integration"], "₹4 LPA - ₹9 LPA", "Build application features.", "Direct Match"),
      makeJob("Full Stack Developer", "Mid Level", 70, ["Frontend", "Backend", "Database"], "₹5 LPA - ₹12 LPA", "Work on frontend and backend.", "Related Role"),
      makeJob("Technical Support Engineer", "Entry Level", 65, ["Troubleshooting", "Communication", "SQL"], "₹2.5 LPA - ₹6 LPA", "Resolve technical issues.", "Related Role")
    ]
  };
};

const recommendJobs = (req, res) => {
  const userId = req.user.id;
  const { resume_id } = req.body;

  if (!resume_id) {
    return res.status(400).json({
      success: false,
      message: "resume_id is required"
    });
  }

  db.query(
    `SELECT id, resume_text, job_role
     FROM resume_uploads
     WHERE id = ? AND user_id = ?`,
    [resume_id, userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Resume not found"
        });
      }

      const resume = rows[0];

      const result = getRecommendedJobsByRole(
        resume.job_role || "",
        resume.resume_text || ""
      );

      db.query(
        `INSERT INTO job_recommendations
         (user_id, resume_id, target_role, recommended_jobs)
         VALUES (?, ?, ?, ?)`,
        [
          userId,
          resume_id,
          result.target_role,
          JSON.stringify(result.recommended_jobs)
        ],
        (insertErr, insertResult) => {
          if (insertErr) {
            return res.status(500).json({
              success: false,
              message: insertErr.message
            });
          }

          return res.status(201).json({
            success: true,
            message: "Job recommendations generated successfully",
            recommendation: {
              id: insertResult.insertId,
              resume_id,
              target_role: result.target_role,
              total_jobs: result.recommended_jobs.length,
              recommended_jobs: result.recommended_jobs
            }
          });
        }
      );
    }
  );
};

const getJobRecommendationHistory = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT id, resume_id, target_role, recommended_jobs, created_at
     FROM job_recommendations
     WHERE user_id = ?
     ORDER BY id DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      const recommendations = rows.map(item => ({
        ...item,
        recommended_jobs:
          typeof item.recommended_jobs === "string"
            ? JSON.parse(item.recommended_jobs)
            : item.recommended_jobs || []
      }));

      return res.status(200).json({
        success: true,
        recommendations
      });
    }
  );
};

module.exports = {
  recommendJobs,
  getJobRecommendationHistory
};
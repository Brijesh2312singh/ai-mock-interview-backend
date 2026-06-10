const searchLiveJobs = (req, res) => {
  const { keyword, location } = req.body;

  if (!keyword) {
    return res.status(400).json({
      success: false,
      message: "keyword is required"
    });
  }

  const jobs = [
    {
      title: `${keyword}`,
      company: "Google",
      location: location || "Bangalore",
      salary: "₹12 LPA - ₹25 LPA",
      job_type: "Full Time",
      apply_url: "https://careers.google.com",
      posted_at: "Recently"
    },
    {
      title: `Senior ${keyword}`,
      company: "Microsoft",
      location: location || "Hyderabad",
      salary: "₹15 LPA - ₹30 LPA",
      job_type: "Full Time",
      apply_url: "https://careers.microsoft.com",
      posted_at: "Recently"
    },
    {
      title: `${keyword} Engineer`,
      company: "TCS",
      location: location || "Remote",
      salary: "₹6 LPA - ₹14 LPA",
      job_type: "Full Time",
      apply_url: "https://www.tcs.com/careers",
      posted_at: "Recently"
    }
  ];

  return res.json({
    success: true,
    keyword,
    location: location || "India",
    jobs
  });
};

module.exports = {
  searchLiveJobs
};
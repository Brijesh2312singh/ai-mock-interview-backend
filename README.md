# AI Mock Interview Backend

AI Career Coach Backend built with Node.js, Express, MySQL, MongoDB, JWT Authentication, Gemini AI, and Swagger Documentation.

## Features

### Authentication
- User Signup
- User Login
- User Profile
- JWT Authentication

### Mock Interview
- Create Interview
- Interview History
- Get Questions
- Submit Answers
- AI Feedback using Gemini
- Interview Result
- Complete Interview
- Dashboard
- Interview Report
- PDF Report Download

### Resume Module
- Resume Upload (PDF/DOCX)
- Resume Analysis
- ATS Score
- Resume History

### Cover Letter
- Generate Cover Letter
- Cover Letter History

### Job Recommendation
- Job Recommendations
- Multiple Career Suggestions
- Job History

### Saved Jobs
- Save Job
- Get Saved Jobs
- Delete Saved Job

### Learning & Career
- Learning Roadmap Generator
- Skill Gap Analysis
- Live Jobs API

## Tech Stack

- Node.js
- Express.js
- MySQL
- MongoDB Atlas
- Mongoose
- JWT
- Gemini AI
- Swagger
- PDFKit
- Multer

## Installation

```bash
git clone https://github.com/Brijesh2312singh/ai-mock-interview-backend.git
cd ai-mock-interview-backend
npm install
```

## Environment Variables

Create `.env`

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_mock_interview

MONGO_URL=your_mongodb_connection

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

## Run Project

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Swagger Documentation

```
http://localhost:3000/api-docs
```

## Author

Brijesh Singh
iOS Developer | Backend Developer

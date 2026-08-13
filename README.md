# SkillSync — AI-Powered Resume Screening & Career Matching System

SkillSync is a full-stack platform designed to streamline student resume screening, ATS scoring, skill gap analysis, course recommendations, and job matching using AI/ML capabilities.

---

## 📋 1. Project Overview

SkillSync is an intelligent, end-to-end career guidance and resume evaluation ecosystem. It enables students to upload technical resumes in standard formats (PDF, DOCX), receive automated NLP-driven section parsing and skill extraction, get explainable ATS candidate scores, discover missing skill gaps, explore targeted course recommendations, and manage job applications. The application enforces role-based access control for Students, Recruiters, and Admins across a decoupled modern architecture.

---

## 🏗️ 2. Project Architecture

SkillSync follows a modern decoupled 3-tier microservice architecture:

```
SkillSync/
├── frontend/       # React + Vite Single Page Application (UI Layer)
├── backend/        # Node.js + Express REST API Server + MongoDB Mongoose (API & DB Layer)
└── ml-service/     # Python + FastAPI AI/ML Microservice (Intelligence & NLP Layer)
```

- **Frontend Tier**: Single Page Application built with React 18, Vite, React Router DOM, and Tailwind CSS.
- **Backend Tier**: Express.js REST API server handling authentication, user profiles, document storage, and application business logic connected to MongoDB via Mongoose.
- **ML Microservice Tier**: FastAPI microservice performing document text parsing (PDF/DOCX), NLP text preprocessing, regex-based skill extraction, and explainable ATS scoring.

---

## ⚙️ 3. PHASE 1 — Project Foundation

Phase 1 established the core project infrastructure, microservice layout, environment configurations, and health check endpoints.

### Implemented Architecture
- **React + Vite Frontend**: Initialized SPA structure with development server on port `5173`.
- **Node.js + Express Backend**: Configured API server running on port `5000` with CORS, JSON body parsing, and static file serving (`/uploads`).
- **MongoDB + Mongoose**: Database integration establishing connection to `mongodb://127.0.0.1:27017/skillsync`.
- **Python + FastAPI ML Service**: AI microservice using Uvicorn ASGI server on port `8000`.

### Environment Configuration (`.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillsync
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
JWT_SECRET=skillsync_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=7d
```

### Service Ports & Health Check Endpoints
- **Frontend**: `http://localhost:5173` (Route: `/`)
- **Backend API**: `http://localhost:5000` (Health Check: `GET /api/health`)
- **Python ML Service**: `http://localhost:8000` (Health Check: `GET /health`)
- **MongoDB Database**: `mongodb://127.0.0.1:27017/skillsync` (Port `27017`)

### Initial Project Directory Structure
```
SkillSync/
├── backend/
│   ├── config/          # Database connection settings
│   ├── controllers/     # API request controllers
│   ├── middleware/      # Auth & RBAC middlewares
│   ├── models/          # Mongoose data models
│   ├── routes/          # Express route definitions
│   ├── services/        # External service connectors (ML service integration)
│   ├── uploads/         # Local resume file storage
│   ├── utils/           # Test suites and seed scripts
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # Navigation, Layout, and UI components
│   │   ├── context/     # Auth Context provider
│   │   ├── pages/       # Auth, Student, Recruiter, Admin pages
│   │   ├── services/    # Axios API client instances
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── ml-service/
    ├── app/
    │   ├── models/      # Pydantic request/response schemas
    │   ├── routes/      # FastAPI endpoint routers
    │   ├── services/    # Text extraction, NLP, ATS scoring logic
    │   ├── utils/       # Skill vocabulary taxonomy
    │   └── main.py
    └── requirements.txt
```

### Phase 1 Verification Results
- Backend health check (`GET http://localhost:5000/api/health`) verified with status `200 OK` and active MongoDB connection.
- Python ML Service health check (`GET http://localhost:8000/health`) verified with status `200 OK` (`status: healthy`).

---

## 🔐 4. PHASE 2 — Authentication + JWT + RBAC

Phase 2 implemented full authentication mechanisms, JWT token lifecycle management, password hashing, password recovery flows, and Role-Based Access Control (RBAC).

### Key Components Implemented
- **User Model (`User.model.js`)**: Mongoose schema storing `fullName`, `email` (unique, lowercase), `password` (hashed), `role` (`student`, `recruiter`, `admin`), `resetPasswordToken`, `resetPasswordExpire`, and `createdAt` timestamps.
- **Roles & Permissions**:
  - `student`: Access to personal profile, resume uploads, ATS analysis, job browsing, saved jobs, applications, courses, and notifications.
  - `recruiter`: Employer access for posting job openings and managing candidate applications.
  - `admin`: Administrative governance and system monitoring.
- **Registration (`POST /api/auth/register`)**: Validates full name, email uniqueness, role assignment, and password matching.
- **Login (`POST /api/auth/login`)**: Verifies credentials, compares hashed passwords using `bcryptjs`, and returns signed JWT tokens.
- **JWT Authentication**: Secure Bearer tokens issued with a 7-day expiration (`JWT_EXPIRES_IN=7d`).
- **Password Hashing**: Automatic pre-save hashing using `bcryptjs` with 10 salt rounds.
- **Protected Routes (`protect` middleware)**: Intercepts incoming requests, validates `Authorization: Bearer <token>` header, decodes user payload, and attaches user to `req.user`.
- **Role-Based Authorization (`authorize` middleware)**: Higher-order middleware restricting routes to specified user roles (e.g. `authorize('student')`).
- **Forgot Password (`POST /api/auth/forgot-password`)**: Generates an unhashed reset token, saves crypto-hashed token to database with a 10-minute expiry, and returns token for recovery.
- **Reset Password (`POST /api/auth/reset-password`)**: Validates token against database hash, checks expiration, updates user password, and returns fresh auth token.

### Authentication API Summary
- `POST /api/auth/register` — User registration (Student / Recruiter).
- `POST /api/auth/login` — Authenticate user & receive JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user session.
- `POST /api/auth/forgot-password` — Request password reset token.
- `POST /api/auth/reset-password` — Reset password using token.
- `GET /api/test/student-only` — RBAC test route for student role.
- `GET /api/test/recruiter-only` — RBAC test route for recruiter role.
- `GET /api/test/admin-only` — RBAC test route for admin role.

### Automated Test Results
- **Suite Command**: `node utils/testAuth.js` (from `backend` directory)
- **Result**: **18/18 tests passed** (100% pass rate).

---

## 🎓 5. PHASE 3 — Student Module

Phase 3 delivered the complete Student experience including profiles, resume management, job search, saved jobs, application workflows, recommended learning pathways, and notification feeds.

### Implemented Student Module Features
- **Student Dashboard (`StudentDashboardPage.jsx`)**: Comprehensive metrics dashboard displaying uploaded resume stats, total applications submitted, saved jobs count, recommended courses, and quick-action links.
- **Student Profile (`StudentProfilePage.jsx`)**: Form to view and update student profile details including institution/college, degree, branch, graduation year, bio, technical skills array, and target career role.
- **Resume Management (`ResumeUploadPage.jsx`)**: Multipart file upload supporting PDF (`.pdf`) and Word (`.docx`) up to 5MB, resume listing, primary resume selection, and secure deletion.
- **Job Browsing & Application Management**:
  - Browse available jobs (`GET /api/jobs`).
  - Save/Unsave job openings (`POST /api/jobs/:id/save`, `DELETE /api/jobs/:id/save`).
  - View saved jobs list (`GET /api/jobs/saved`).
  - Submit applications with optional cover notes (`POST /api/applications`).
  - View submitted job applications status (`GET /api/applications`).
- **Recommended Courses (`RecommendedCoursesPage.jsx`)**: Suggested online courses tailored to candidate skill profile (`GET /api/courses/recommended`).
- **Notifications Feed (`NotificationsPage.jsx`)**: System alert feed for application updates and status notifications (`GET /api/notifications`).
- **Protected Student Functionality**: Middleware guards (`protect` + `authorize('student')`) enforce strict isolation so non-students and cross-account users cannot access student records (returns `401 Unauthorized` or `403 Forbidden`).

### Frontend Student Pages
- `StudentDashboardPage.jsx` — Student overview dashboard.
- `StudentProfilePage.jsx` — Profile management page.
- `ResumeUploadPage.jsx` — Resume manager & upload page.
- `ApplicationsPage.jsx` — Applied jobs tracking page.
- `SavedJobsPage.jsx` — Bookmarked jobs page.
- `JobMatchingPage.jsx` — Job matches & opportunities page.
- `SkillGapsPage.jsx` — Skill gaps visualization page.
- `RecommendedCoursesPage.jsx` — Course recommendations page.
- `NotificationsPage.jsx` — System notifications center.
- `StudentSettingsPage.jsx` — Student account settings.

### Database Models Implemented
- `User.model.js` — Stores user account and authentication data.
- `Resume.model.js` — Stores uploaded resume file details, raw text, parsed section data, detected skills, and ATS score metrics.
- `Job.model.js` — Job vacancy postings.
- `Application.model.js` — Job applications mapping students to jobs.
- `SavedJob.model.js` — Student job bookmarks.
- `Course.model.js` — Recommended learning courses catalog.
- `Notification.model.js` — User notifications and alerts.

### Automated Test & Regression Results
- **Suite Command**: `node utils/testPhase3.js` (from `backend` directory)
- **Result**: **19/19 tests passed** (100% pass rate).
- **Regression Status**: 0 regressions detected across Phase 1 health endpoints and Phase 2 authentication APIs.

---

## 🧠 6. PHASE 4 — Resume Parsing + ATS + AI/ML Architecture

### 1. Resume Text Extraction Engine
- **PDF Extraction**: `pypdf` extracts plain text page by page with UTF-8 fallback.
- **DOCX Extraction**: `python-docx` extracts paragraphs, headers, and structured tables.
- **Supported Formats**: PDF (`.pdf`) and Word (`.docx`).
- **Resilience**: Robust fallback handling for corrupted, empty, or unformatted text streams.

### 2. NLP Text Preprocessing & Section Detection
- **Preprocessing**: Whitespace cleanup, unicode normalization, line break cleaning, duplicate space removal while preserving document structure.
- **Section Parsing**: Rule-based NLP section identifier extracting:
  - `contact`: Full name, email, phone, LinkedIn, GitHub.
  - `summary`: Professional summary / objective overview.
  - `skills`: Detected technical competencies.
  - `education`: Institutions, degree programs, field of study.
  - `experience`: Work history, company names, role descriptions.
  - `projects`: Technical projects and technologies used.
  - `certifications`: Industry certifications and credentials.
  - `achievements`: Awards and accomplishments.

### 3. Skill Extraction Vocabulary
Extensible tech vocabulary taxonomy matching 30+ core technical skills using word boundary regex matching:
`Python`, `Java`, `JavaScript`, `TypeScript`, `React`, `Node.js`, `Express`, `MongoDB`, `SQL`, `MySQL`, `PostgreSQL`, `C`, `C++`, `Machine Learning`, `Deep Learning`, `Data Science`, `Data Analytics`, `Pandas`, `NumPy`, `Scikit-learn`, `TensorFlow`, `PyTorch`, `Docker`, `Git`, `GitHub`, `AWS`, `Azure`, `HTML`, `CSS`, `REST API`, `FastAPI`, `GraphQL`, `Kubernetes`, `Linux`.

### 4. Rule-Based ATS Scoring Methodology
Transparent, explainable ATS scoring algorithm returning:
- `overallScore`: Weighted summary of section completeness (30%), skills count (25%), keyword relevance (15%), work experience (15%), education (10%), and projects (5%).
- `keywordScore`: Terminology and word density score (0 - 100).
- `skillsScore`: Score based on count of verified technical skills (0 - 100).
- `sectionCompletenessScore`: Essential header presence score (0 - 100).
- `educationScore` & `experienceScore` & `projectScore`: Category match scores.
- `missingCommonSkills`: Identifies core foundational skills not detected in candidate text.
- `recommendations`: Actionable advice for resume improvement.

### 5. ATS Frontend Integration
- `ResumeAnalysisPage.jsx` & `AtsScorePage.jsx`: Interactive visual dashboard rendering overall ATS score gauge, detailed category breakdown, detected skills tags, missing foundational skills warnings, and actionable resume improvement recommendations. Automates user profile skills updating upon successful analysis.

---

## 📡 ML Microservice API Endpoints (`http://localhost:8000`)

- `GET /health` — Microservice health status.
- `POST /api/ml/analyze-resume` — Executes full extraction, section parsing, skill detection, and ATS scoring.
- `POST /api/ml/extract-skills` — Standalone skill extraction endpoint.
- `POST /api/ml/ats-score` — Standalone ATS scoring endpoint.

---

## 📡 Backend Resume Analysis APIs (`http://localhost:5000`)

- `POST /api/resumes/:id/analyze` — Initiates ML pipeline for authenticated resume owner.
- `GET /api/resumes/:id/analysis` — Retrieves stored analysis & ATS score breakdown.

---

## 🧪 Phase 4 Test Results
- **Suite Command**: `node utils/testPhase4.js` (from `backend` directory)
- **Result**: **8/8 tests passed** (100% pass rate).

---

## 📊 7. CURRENT IMPLEMENTATION STATUS

Phase 1 — COMPLETE  
Phase 2 — COMPLETE  
Phase 3 — COMPLETE  
Phase 4 — COMPLETE  
Phase 5 — NOT STARTED  
Phase 6 — NOT STARTED  
Phase 7 — NOT STARTED  
Phase 8 — NOT STARTED  
Final — PENDING  

---

## 🚀 8. SERVICE STATUS MATRIX

| Service | Technology | Port / URL | Health Route | Status |
|---|---|---|---|---|
| **Frontend** | React + Vite | `http://localhost:5173` | `/` | Operational |
| **Backend** | Express + Node.js | `http://localhost:5000` | `/api/health` | Operational |
| **ML Service** | FastAPI + Python | `http://localhost:8000` | `/health` | Operational |
| **Database** | MongoDB | `mongodb://127.0.0.1:27017/skillsync` | Mongoose | Connected |

---

## 🧪 9. TESTING & REGRESSION STATUS

SkillSync includes automated integration test suites for verifying backend routes, authentication mechanisms, student features, microservice IPC, and ML pipeline scoring.

| Phase | Test Suite | Command | Total Tests | Passed | Failed | Status |
|---|---|---|---|---|---|---|
| **Phase 1** | System Health Checks | Service startup ping | 3 | 3 | 0 | 100% PASS |
| **Phase 2** | Auth & RBAC Suite | `node utils/testAuth.js` | 18 | 18 | 0 | 100% PASS |
| **Phase 3** | Student Module Suite | `node utils/testPhase3.js` | 19 | 19 | 0 | 100% PASS |
| **Phase 4** | Resume & ATS ML Suite | `node utils/testPhase4.js` | 8 | 8 | 0 | 100% PASS |
| **TOTAL** | **Full Integration** | All suites combined | **48** | **48** | **0** | **100% PASS** |

- **Regression Status**: Zero regressions across all operational tiers. All endpoints retain backward compatibility across completed phases.

---

## 💻 10. HOW TO RUN THE PROJECT

### Prerequisites
1. **Node.js** (v18+ recommended) & `npm` installed.
2. **Python** (v3.10+ recommended) & `pip` installed.
3. **MongoDB** running locally at `mongodb://127.0.0.1:27017/skillsync`.

---

### Step 1: Start MongoDB
Ensure MongoDB daemon is active on default port `27017`:
```bash
mongod
```

---

### Step 2: Start Node.js Backend Server
From the project root:
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

---

### Step 3: Start Python ML Microservice
From the project root in a new terminal:
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*ML Microservice runs on `http://localhost:8000`.*

---

### Step 4: Start React Frontend Application
From the project root in a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

### Running Automated Test Suites
To run all automated test suites, execute the following from the `backend/` directory:

```bash
# Phase 2 Authentication & RBAC Suite (18 tests)
node utils/testAuth.js

# Phase 3 Student Module Suite (19 tests)
node utils/testPhase3.js

# Phase 4 Resume Parsing & ATS AI/ML Suite (8 tests)
node utils/testPhase4.js
```

---

## 📡 11. API OVERVIEW

All currently implemented APIs are listed below grouped by development phase:

### System & Health APIs (Phase 1)
- `GET /` — API server welcome & status check.
- `GET /api/health` — Backend API and MongoDB database health check.
- `GET http://localhost:8000/health` — ML Service health status.

### Authentication & Authorization APIs (Phase 2)
- `POST /api/auth/register` — Register new Student or Recruiter account.
- `POST /api/auth/login` — Login user & return JWT token.
- `GET /api/auth/me` — Get current user session (Protected).
- `POST /api/auth/forgot-password` — Generate password reset token.
- `POST /api/auth/reset-password` — Reset password using token.
- `GET /api/test/student-only` — Test route restricted to Student role.
- `GET /api/test/recruiter-only` — Test route restricted to Recruiter role.
- `GET /api/test/admin-only` — Test route restricted to Admin role.

### Student Module APIs (Phase 3)
- `GET /api/profile` — Fetch student profile details.
- `PUT /api/profile` — Update student profile details & skills.
- `POST /api/resumes/upload` — Upload resume (PDF or DOCX file).
- `GET /api/resumes` — List uploaded resumes for authenticated student.
- `GET /api/resumes/:id` — Retrieve single resume details.
- `DELETE /api/resumes/:id` — Delete uploaded resume.
- `PUT /api/resumes/:id/primary` — Mark resume as primary.
- `GET /api/jobs` — Browse job postings list.
- `POST /api/jobs/:id/save` — Save job to student bookmarks.
- `DELETE /api/jobs/:id/save` — Remove job from student bookmarks.
- `GET /api/jobs/saved` — List saved jobs for authenticated student.
- `POST /api/applications` — Submit job application.
- `GET /api/applications` — List submitted job applications.
- `GET /api/courses/recommended` — Retrieve recommended learning courses.
- `GET /api/notifications` — Retrieve student notifications.

### Resume Parsing, ATS & ML APIs (Phase 4)
- `POST http://localhost:8000/api/ml/analyze-resume` — ML endpoint for text extraction, section detection, skill extraction, and ATS scoring.
- `POST http://localhost:8000/api/ml/extract-skills` — ML endpoint for standalone skill extraction.
- `POST http://localhost:8000/api/ml/ats-score` — ML endpoint for standalone ATS score calculation.
- `POST /api/resumes/:id/analyze` — Backend route triggering ML analysis on uploaded resume.
- `GET /api/resumes/:id/analysis` — Backend route retrieving stored ML analysis & ATS breakdown.

---

## 🔮 12. FUTURE PHASES

The following phases are planned for upcoming development iterations:

- **Phase 5 — Recruiter Module & Job Posting Management** *(NOT STARTED)*: Recruiter dashboard, posting job openings, candidate application management, resume review workflow.
- **Phase 6 — AI Skill Gap Analysis & Smart Course Recommendations Engine** *(NOT STARTED)*: Automated skill gap analysis comparing candidate profile skills against targeted job requirements, course matching algorithms.
- **Phase 7 — Automated Candidate Ranking & AI Match Score Engine** *(NOT STARTED)*: Automated candidate ranking for job listings, semantic match score calculation, recruiter filtering & sorting engine.
- **Phase 8 — Advanced Analytics, Platform Administration & Deployment** *(NOT STARTED)*: Platform metrics dashboard, recruiter analytics, candidate analytics, production deployment configuration.

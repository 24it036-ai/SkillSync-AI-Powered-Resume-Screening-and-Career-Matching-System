# SkillSync — AI-Powered Resume Screening & Career Matching System

SkillSync is a full-stack platform designed to streamline student resume screening, ATS scoring, skill gap analysis, course recommendations, and job matching using AI/ML capabilities.

---

## 🏗️ Project Architecture

SkillSync follows a modern decoupled 3-tier microservice architecture:

```
SkillSync/
├── frontend/       # React + Vite Single Page Application
├── backend/        # Node.js + Express REST API Server + MongoDB Mongoose
└── ml-service/     # Python + FastAPI AI/ML Microservice
```

---

## 🧠 Phase 4: Resume Parsing + ATS + AI/ML Architecture

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

## 🧪 Running Automated Test Suites

From `backend` directory:
```bash
# Run Phase 4 Resume Parsing + ATS + AI/ML Test Suite
node utils/testPhase4.js

# Run Phase 3 Student Module Test Suite
node utils/testPhase3.js

# Run Phase 2 Authentication & RBAC Test Suite
node utils/testAuth.js
```

---

## 🚀 Service Matrix & Status

| Service | Technology | Port / URL | Health Route | Status |
|---|---|---|---|---|
| **Frontend** | React + Vite | `http://localhost:5173` | `/` | Operational |
| **Backend** | Express + Node.js | `http://localhost:5000` | `/api/health` | Operational |
| **ML Service** | FastAPI + Python | `http://localhost:8000` | `/health` | Operational |
| **Database** | MongoDB | `mongodb://127.0.0.1:27017/skillsync` | Mongoose | Connected |

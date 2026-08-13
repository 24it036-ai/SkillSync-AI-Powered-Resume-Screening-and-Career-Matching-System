# SkillSync ML Service

Python + FastAPI Microservice for AI/ML Processing (Resume Parsing, ATS Scoring, Job Matching).

---

## 🚀 How to Run

1. Create a Python Virtual Environment:
```bash
python -m venv venv
```

2. Activate environment:
- Windows PowerShell:
```powershell
.\venv\Scripts\Activate.ps1
```
- Linux/macOS:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run FastAPI server:
```bash
uvicorn app.main:app --port 8000 --reload
```

---

## 🩺 Endpoints

- `GET /health` — Check ML service operational status.

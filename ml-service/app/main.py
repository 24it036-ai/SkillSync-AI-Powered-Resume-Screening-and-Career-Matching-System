from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.routes.analysis import router as analysis_router

app = FastAPI(
    title="SkillSync ML Service",
    description="AI-Powered Resume Screening & Career Matching ML Microservice",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(analysis_router)

@app.get("/")
def read_root():
    return {
        "service": "SkillSync Python ML Service",
        "status": "online",
        "health_check": "/health"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SkillSync Python ML Service",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

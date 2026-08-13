from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os

from app.services.document_parser import DocumentParser
from app.services.text_processor import TextProcessor
from app.services.section_extractor import SectionExtractor
from app.services.skill_extractor import SkillExtractor
from app.services.ats_scorer import ATSScorer

router = APIRouter(prefix="/api/ml", tags=["Resume Analysis"])

class AnalyzeResumeRequest(BaseModel):
    file_path: Optional[str] = None
    file_type: Optional[str] = None
    raw_text: Optional[str] = None

class ExtractSkillsRequest(BaseModel):
    text: str

class ATSScoreRequest(BaseModel):
    text: str
    sections: Optional[Dict[str, Any]] = None
    skills: Optional[List[str]] = None

@router.post("/analyze-resume")
def analyze_resume(request: AnalyzeResumeRequest):
    """Full ML Resume Analysis Pipeline: Extract, Clean, Parse Sections, Extract Skills, ATS Score."""
    try:
        raw_text = ""
        if request.file_path:
            if not os.path.exists(request.file_path):
                raise HTTPException(status_code=404, detail=f"File not found on server disk: {request.file_path}")
            raw_text = DocumentParser.parse_document(request.file_path, request.file_type)
        elif request.raw_text:
            raw_text = request.raw_text
        else:
            raise HTTPException(status_code=400, detail="Provide either file_path or raw_text to analyze.")

        if not raw_text or not raw_text.strip():
            raise HTTPException(status_code=400, detail="Extracted document text is empty.")

        # Step 2: Clean and normalize text
        cleaned_text = TextProcessor.clean_text(raw_text)

        # Step 3: Extract structured sections
        parsed_data = SectionExtractor.extract_sections(cleaned_text)

        # Step 4: Extract skills
        detected_skills = SkillExtractor.extract_skills(cleaned_text)
        parsed_data["skills"] = detected_skills

        # Step 5: Calculate ATS score breakdown
        ats_breakdown = ATSScorer.calculate_ats_score(cleaned_text, parsed_data, detected_skills)

        return {
            "success": True,
            "extractedText": cleaned_text,
            "parsedData": parsed_data,
            "detectedSkills": detected_skills,
            "atsScore": ats_breakdown["overallScore"],
            "atsBreakdown": ats_breakdown
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Service Analysis Error: {str(e)}")

@router.post("/extract-skills")
def extract_skills(request: ExtractSkillsRequest):
    """Standalone skill extraction API."""
    skills = SkillExtractor.extract_skills(request.text)
    return {"success": True, "count": len(skills), "skills": skills}

@router.post("/ats-score")
def calculate_ats_score(request: ATSScoreRequest):
    """Standalone ATS score calculation API."""
    sections = request.sections or SectionExtractor.extract_sections(request.text)
    skills = request.skills or SkillExtractor.extract_skills(request.text)
    ats_result = ATSScorer.calculate_ats_score(request.text, sections, skills)
    return {"success": True, "atsScore": ats_result["overallScore"], "atsBreakdown": ats_result}

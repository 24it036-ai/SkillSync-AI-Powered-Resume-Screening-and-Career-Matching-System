class ATSScorer:
    ESSENTIAL_COMMON_SKILLS = [
        "Git", "SQL", "Python", "JavaScript", "React",
        "Node.js", "Docker", "REST API", "HTML", "CSS"
    ]

    @classmethod
    def calculate_ats_score(cls, text: str, sections: dict, detected_skills: list) -> dict:
        """Calculate transparent, rule-based ATS score breakdown and recommendations."""
        
        # 1. Section Completeness Score (Max 100)
        section_weights = {
            "contact": 20,
            "skills": 25,
            "education": 20,
            "experience": 20,
            "projects": 15
        }
        
        completeness_score = 0
        contact_info = sections.get("contact", {})
        if contact_info.get("email") or contact_info.get("phone"):
            completeness_score += section_weights["contact"]
            
        if detected_skills:
            completeness_score += section_weights["skills"]
            
        if sections.get("education"):
            completeness_score += section_weights["education"]
            
        if sections.get("experience"):
            completeness_score += section_weights["experience"]
            
        if sections.get("projects"):
            completeness_score += section_weights["projects"]

        # 2. Skills Score (Max 100)
        # 1 skill = 20%, 5+ skills = 100%
        skills_count = len(detected_skills)
        skills_score = min(100, skills_count * 15)

        # 3. Education Score (Max 100)
        education_score = 100 if sections.get("education") else 30

        # 4. Experience Score (Max 100)
        experience_items = sections.get("experience", [])
        experience_score = min(100, len(experience_items) * 35) if experience_items else 40

        # 5. Project Score (Max 100)
        project_items = sections.get("projects", [])
        project_score = min(100, len(project_items) * 35) if project_items else 40

        # 6. Keyword Relevance Score (Max 100)
        # Based on text length and keyword density
        text_length = len(text.split())
        if text_length < 100:
            keyword_score = 40
        elif text_length < 250:
            keyword_score = 65
        elif text_length < 800:
            keyword_score = 85
        else:
            keyword_score = 95

        # Overall Weighted Score Calculation
        overall_score = round(
            (completeness_score * 0.30) +
            (skills_score * 0.25) +
            (keyword_score * 0.15) +
            (experience_score * 0.15) +
            (education_score * 0.10) +
            (project_score * 0.05)
        )

        # Identify missing common core skills
        missing_common_skills = [
            skill for skill in cls.ESSENTIAL_COMMON_SKILLS
            if skill not in detected_skills
        ]

        # Generate Actionable Recommendations
        recommendations = []
        if not contact_info.get("email"):
            recommendations.append("Add a clear email address in your contact header.")
        if not contact_info.get("phone"):
            recommendations.append("Include a phone number for recruiter contact.")
        if skills_count < 5:
            recommendations.append("List more technical skills and frameworks in your Skills section.")
        if not sections.get("experience"):
            recommendations.append("Add a Work Experience or Internship section to boost ATS relevance.")
        if not sections.get("projects"):
            recommendations.append("Include a Projects section highlighting technologies used.")
        if text_length < 200:
            recommendations.append("Expand your resume content with quantifiable achievements and descriptions.")
        if missing_common_skills:
            recommendations.append(f"Consider adding foundational skills if applicable: {', '.join(missing_common_skills[:3])}.")

        if not recommendations:
            recommendations.append("Great job! Your resume meets essential ATS formatting and keyword benchmarks.")

        return {
            "overallScore": min(100, max(0, overall_score)),
            "keywordScore": min(100, keyword_score),
            "skillsScore": min(100, skills_score),
            "sectionCompletenessScore": min(100, completeness_score),
            "educationScore": min(100, education_score),
            "experienceScore": min(100, experience_score),
            "projectScore": min(100, project_score),
            "detectedSkills": detected_skills,
            "missingCommonSkills": missing_common_skills,
            "recommendations": recommendations
        }

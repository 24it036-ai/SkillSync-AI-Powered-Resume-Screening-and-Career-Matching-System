import re

class SkillExtractor:
    SKILL_VOCABULARY = {
        "Python": [r"\bpython\b"],
        "Java": [r"\bjava\b"],
        "JavaScript": [r"\bjavascript\b", r"\bjs\b"],
        "TypeScript": [r"\btypescript\b", r"\bts\b"],
        "React": [r"\breact\b", r"\breactjs\b", r"\breact\.js\b"],
        "Node.js": [r"\bnode\.js\b", r"\bnodejs\b", r"\bnode\b"],
        "Express": [r"\bexpress\b", r"\bexpressjs\b"],
        "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
        "SQL": [r"\bsql\b"],
        "MySQL": [r"\bmysql\b"],
        "PostgreSQL": [r"\bpostgresql\b", r"\bpostgres\b"],
        "C": [r"\bc\b"],
        "C++": [r"\bc\+\+\b", r"\bcpp\b"],
        "Machine Learning": [r"\bmachine learning\b", r"\bml\b"],
        "Deep Learning": [r"\bdeep learning\b", r"\bdl\b"],
        "Data Science": [r"\bdata science\b"],
        "Data Analytics": [r"\bdata analytics\b", r"\bdata analysis\b"],
        "Pandas": [r"\bpandas\b"],
        "NumPy": [r"\bnumpy\b"],
        "Scikit-learn": [r"\bscikit-learn\b", r"\bscikitlearn\b", r"\bsklearn\b"],
        "TensorFlow": [r"\btensorflow\b", r"\btf\b"],
        "PyTorch": [r"\bpytorch\b"],
        "Docker": [r"\bdocker\b"],
        "Git": [r"\bgit\b"],
        "GitHub": [r"\bgithub\b"],
        "AWS": [r"\baws\b", r"\bamazon web services\b"],
        "Azure": [r"\bazure\b"],
        "HTML": [r"\bhtml\b", r"\bhtml5\b"],
        "CSS": [r"\bcss\b", r"\bcss3\b"],
        "REST API": [r"\brest api\b", r"\brestful\b", r"\brest apis\b"],
        "GraphQL": [r"\bgraphql\b"],
        "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
        "Linux": [r"\blinux\b"],
        "FastAPI": [r"\bfastapi\b"],
        "Flask": [r"\bflask\b"],
        "Django": [r"\bdjango\b"],
        "Tailwind": [r"\btailwind\b", r"\btailwindcss\b"]
    }

    @classmethod
    def extract_skills(cls, text: str) -> list:
        """Extract detected technical skills from candidate resume text."""
        if not text:
            return []

        lower_text = text.lower()
        detected_skills = []

        for skill_name, patterns in cls.SKILL_VOCABULARY.items():
            for pattern in patterns:
                # Use regex search with word boundaries
                if re.search(pattern, lower_text, re.IGNORECASE):
                    detected_skills.append(skill_name)
                    break

        return sorted(list(set(detected_skills)))

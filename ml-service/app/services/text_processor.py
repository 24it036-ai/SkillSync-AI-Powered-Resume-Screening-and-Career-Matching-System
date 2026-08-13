import re

class TextProcessor:
    @staticmethod
    def clean_text(raw_text: str) -> str:
        """Clean and normalize raw extracted resume text."""
        if not raw_text:
            return ""

        # Replace non-breaking spaces and special quotes
        text = raw_text.replace('\xa0', ' ').replace('’', "'").replace('“', '"').replace('”', '"')
        
        # Replace non-printable ASCII characters while preserving newlines
        text = re.sub(r'[^\x00-\x7F]+', ' ', text)
        
        # Normalize multiple spaces per line to single space
        lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.splitlines()]
        
        # Remove excessive blank lines (max 2 consecutive newlines)
        cleaned_lines = []
        blank_count = 0
        for line in lines:
            if not line:
                blank_count += 1
                if blank_count <= 1:
                    cleaned_lines.append(line)
            else:
                blank_count = 0
                cleaned_lines.append(line)

        return "\n".join(cleaned_lines).strip()

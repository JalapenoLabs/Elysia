# Copyright © 2025 Jalapeno Labs

from pathlib import Path

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

def get_template(name: str) -> str:
	with open(TEMPLATES_DIR / f"{name}.md", "r", encoding="utf-8") as file:
		return file.read()

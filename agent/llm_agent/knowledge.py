"""Loads the checked-in Primer brand-knowledge doc for the ui_description prompt slot."""

from __future__ import annotations

from pathlib import Path

BRAND_GUIDANCE_PATH = (
    Path(__file__).resolve().parents[1] / "knowledge" / "brand-guidance.md"
)


def load_brand_guidance() -> str:
    """Returns the Primer brand-guidance prose injected at prompt assembly (build time)."""
    return BRAND_GUIDANCE_PATH.read_text(encoding="utf-8").strip()

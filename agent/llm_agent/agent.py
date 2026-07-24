"""Builds the live A2UI LlmAgent: system prompt + stub toolset + Gemini model knob."""

from __future__ import annotations

import os
from pathlib import Path

from google.adk.agents import LlmAgent

from llm_agent.prompt import build_system_prompt
from llm_agent.tools import STUB_TOOLS

# Cheap Gemini tier by default (spec decision 7); overridable via MODEL_NAME.
DEFAULT_MODEL = "gemini-2.5-flash"

AGENT_NAME = "a2ui_github_live_agent"


def model_name() -> str:
    return os.environ.get("MODEL_NAME", DEFAULT_MODEL)


def build_llm_agent(model: str | None = None) -> LlmAgent:
    """Constructs the ADK LlmAgent with the assembled system prompt and stub tools."""
    prompt = build_system_prompt()
    # Debug aid: dump the assembled system prompt so it can be inspected verbatim.
    dump_path = Path(__file__).resolve().parent.parent / "system_prompt.dump.txt"
    dump_path.write_text(prompt, encoding="utf-8")
    return LlmAgent(
        name=AGENT_NAME,
        model=model or model_name(),
        # A provider callable, not a plain string: ADK templates string instructions
        # against session state, and the schema/example JSON braces in the prompt
        # (e.g. `{path}`) would be read as state variables and raise KeyError.
        instruction=lambda _ctx: prompt,
        tools=list(STUB_TOOLS),
    )

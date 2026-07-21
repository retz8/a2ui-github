"""Builds the live A2UI LlmAgent: system prompt + stub toolset + Gemini model knob."""

from __future__ import annotations

import os

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
    return LlmAgent(
        name=AGENT_NAME,
        model=model or model_name(),
        instruction=build_system_prompt(),
        tools=list(STUB_TOOLS),
    )

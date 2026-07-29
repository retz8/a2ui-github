"""Builds the live A2UI LlmAgent: system prompt + tool backend + Gemini model knob."""

from __future__ import annotations

import logging
import os
from pathlib import Path

from google.adk.agents import LlmAgent

from llm_agent.mcp import GITHUB_MCP_TOOLSETS, GITHUB_MCP_URL, build_github_toolset
from llm_agent.prompt import build_system_prompt
from llm_agent.tools import STUB_TOOLS

logger = logging.getLogger(__name__)

# Lite Gemini tier by default — the model the demo runs on; overridable via MODEL_NAME.
DEFAULT_MODEL = "gemini-3.5-flash-lite"

# Live GitHub by default. The stub exists so testing and manual client work need
# not consume GitHub MCP call allowance, but it is always an explicit opt-in.
DEFAULT_BACKEND = "mcp"

AGENT_NAME = "a2ui_github_live_agent"


def model_name() -> str:
    return os.environ.get("MODEL_NAME", DEFAULT_MODEL)


def tool_backend() -> str:
    return os.environ.get("TOOL_BACKEND", DEFAULT_BACKEND)


def build_tools() -> list:
    """Resolves the tool backend, naming the choice in the log.

    The log line is what makes an MCP default safe: which backend answered is
    never a guess.
    """
    backend = tool_backend()
    if backend == "stub":
        logger.info(
            "tool backend: stub — canned fixture data, no GitHub calls (TOOL_BACKEND=stub)"
        )
        return list(STUB_TOOLS)
    if backend == "mcp":
        toolset = build_github_toolset()
        logger.info(
            "tool backend: mcp — %s, toolsets=%s",
            GITHUB_MCP_URL,
            ",".join(GITHUB_MCP_TOOLSETS),
        )
        return [toolset]
    raise ValueError(
        f"TOOL_BACKEND={backend!r} is not a known backend; expected 'mcp' or 'stub'."
    )


def build_llm_agent(model: str | None = None) -> LlmAgent:
    """Constructs the ADK LlmAgent with the assembled system prompt and tools."""
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
        tools=build_tools(),
    )

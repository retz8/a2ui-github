"""System-prompt assembly for the live agent: authored role/workflow + SDK-generated bulk."""

from __future__ import annotations

from a2ui.schema.manager import A2uiSchemaManager

from llm_agent.catalog import live_schema_manager
from llm_agent.knowledge import load_brand_guidance

ROLE_DESCRIPTION = (
    "You are the GitHub maintainer's-morning agent. You turn a maintainer's natural-language "
    "request about the a2ui-project/a2ui repository into a single rich A2UI surface rendered in "
    "GitHub's Primer design language. You never answer in prose when a surface would serve the "
    "user better: you compose a screen from the catalog's components and bind it to real data. "
    "You read repository data through the provided tools; you never invent PR numbers, titles, "
    "authors, or counts — every value shown on a surface comes from a tool result."
)

WORKFLOW_DESCRIPTION = (
    "For a request that names or implies repository data (pull requests, reviews, a specific PR), "
    "first call the appropriate tool to fetch it, then compose one surface that presents the "
    "result. Bind dynamic values (titles, authors, counts, states) through the data model so the "
    "surface reflects the fetched data rather than hard-coding it. Prefer a list surface for "
    "'what needs my attention' requests and a detail surface for a single named PR. Keep the "
    "surface to what the request asks for; do not add unrequested sections."
)


def build_system_prompt(schema_manager: A2uiSchemaManager | None = None) -> str:
    """Assembles the full system instruction via the SDK's generate_system_prompt.

    Authored content is only ROLE/WORKFLOW; the brand doc feeds ui_description, and the
    full catalog schema and the 7.1 examples are injected by the SDK.
    """
    sm = schema_manager or live_schema_manager()
    return sm.generate_system_prompt(
        role_description=ROLE_DESCRIPTION,
        workflow_description=WORKFLOW_DESCRIPTION,
        ui_description=load_brand_guidance(),
        include_schema=True,
        include_examples=True,
    )

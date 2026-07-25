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

# The array-wrapping rule exists because the SDK's streaming parser only reads a
# top-level JSON array inside an <a2ui-json> block; a bare object — which the SDK's
# own at-end parse_response accepts — makes it raise mid-stream.
WORKFLOW_DESCRIPTION = (
    "For a request that names or implies repository data (pull requests, reviews, a specific PR), "
    "first call the appropriate tool to fetch it, then compose one surface that presents the "
    "result. Bind dynamic text-like values (titles, authors, counts, timestamps) through the "
    "data model so the surface reflects the fetched data. Keep the "
    "surface to what the request asks for; do not add unrequested sections. Always set "
    '"sendDataModel": true in createSurface, so the client reports the surface\'s current '
    "data model — including the user's local edits, like selections — back to you with "
    "every message. Inside every "
    "<a2ui-json> block, the content MUST be a single JSON array of A2UI messages — wrap even "
    "a lone message in a list; never emit a bare object. Data-bind only properties whose "
    "schema is a dynamic type. Enum- or literal-typed properties — StateLabel's status, "
    "Icon's fill and name — can NEVER be data-bound: always write a literal value chosen "
    "from the tool result (a pull request with state 'closed' and a merged_at timestamp is "
    "status 'pullMerged'; 'closed' without one is 'pullClosed'; draft true is 'draft'). "
    "Inside a list template (children bound by componentId + path), an enum-typed property "
    "cannot vary per row: fold the state into a bound text field, or unroll the rows as "
    "individually authored components when per-row state emphasis is the point. Bind item "
    "fields inside a template with RELATIVE paths — {\"path\": \"title\"}, never "
    "{\"path\": \"/title\"}; a leading slash resolves from the surface root, not the item."
)


# The SDK renders the examples under a bare "### Examples:" header at the end of the
# prompt, where each example — a request-shaped `intent` plus a complete surface with
# plausible data — reads as a ready-made answer to a matching user prompt and gets
# parroted verbatim, canned data and all, with no tool call. This framing, spliced in
# right after the header, names what the examples are instead.
EXAMPLES_FRAMING = (
    "The examples below demonstrate composition idioms of this catalog. Their data "
    "values are illustrative and must never appear in a response: every value on a "
    "real surface comes from a tool call made in the current conversation."
)

_EXAMPLES_HEADER = "### Examples:\n"


def build_system_prompt(schema_manager: A2uiSchemaManager | None = None) -> str:
    """Assembles the full system instruction via the SDK's generate_system_prompt.

    Authored content is only ROLE/WORKFLOW; the brand doc feeds ui_description, and the
    full catalog schema and the 7.1 examples are injected by the SDK (with the examples
    framing spliced under the SDK's header — it offers no slot for it).
    """
    sm = schema_manager or live_schema_manager()
    prompt = sm.generate_system_prompt(
        role_description=ROLE_DESCRIPTION,
        workflow_description=WORKFLOW_DESCRIPTION,
        ui_description=load_brand_guidance(),
        include_schema=True,
        include_examples=True,
    )
    return prompt.replace(
        _EXAMPLES_HEADER, _EXAMPLES_HEADER + EXAMPLES_FRAMING + "\n\n", 1
    )

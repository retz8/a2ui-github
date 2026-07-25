# Task 7.3 — GitHub MCP Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the live agent's canned stub toolset with the official remote GitHub MCP server (read-only), and expand the agent from an a2ui-project/a2ui-only agent into a general GitHub agent.

**Architecture:** A new `agent/llm_agent/mcp.py` owns everything about the remote MCP connection — endpoint, pinned toolset list, PAT lookup, headers, and toolset construction. `agent/llm_agent/agent.py` gains a `TOOL_BACKEND` switch that picks between that toolset and the existing stub, defaulting to MCP and failing fast when the PAT is missing. `agent/llm_agent/prompt.py` generalizes the agent's role away from a single repository and gains subject-resolution and tool-economy rules. Documentation lands first, because the rewritten SPEC demo beats are what the live verification runs against.

**Tech Stack:** Python 3.14, `uv`, Google ADK 2.5.0 (`google.adk.tools.mcp_tool.McpToolset` + `StreamableHTTPConnectionParams`), pytest, `python-dotenv`.

## Global Constraints

- Spec of record: `_dev/docs/spec/task-7.3-github-mcp-wiring.md`. Every decision below traces to it.
- **Read-only is enforced twice** and neither layer may be dropped: the server's `/readonly` endpoint, and a PAT with no write permission.
- **The stub is untouched.** Do not re-record its fixtures, mirror MCP tool signatures, or extend its coverage. The only stub-adjacent change is the backend switch.
- **The automated suite stays zero-LLM and zero-network.** `agent/README.md:28-29` promises this. No test may make a network call. `McpToolset.__init__` only stores parameters and constructs a session manager — it does not connect — so wiring is assertable offline.
- **`_dev/` docs are committed on `main` only**, never on a worktree branch (`CLAUDE.md` §Daily-work harness). Task 1 therefore runs on `main` *before* the worktree is created; Tasks 2–5 run in the worktree.
- Conventional commits, `<type>(phase-7): …`.
- The ADK class is `McpToolset` (ADK 2.5.0 also exports a legacy `MCPToolset` alias — use `McpToolset`).
- Run commands from `agent/`. The suite is `uv run pytest`.

## File Structure

| File | Responsibility |
|---|---|
| `SPEC.md` (modify §3) | Design source of truth — demo framing, persona, the five beats |
| `_dev/docs/spec/phase-7-agent.md` (modify) | Phase scope statement, decision 7, open items |
| `agent/llm_agent/mcp.py` (create) | Remote MCP endpoint, pinned toolsets, PAT lookup, headers, toolset construction |
| `agent/llm_agent/agent.py` (modify) | `TOOL_BACKEND` switch, backend log line, agent assembly |
| `agent/llm_agent/prompt.py` (modify) | Generalized role, subject-resolution and tool-economy rules |
| `agent/tests/test_llm_mcp.py` (create) | Offline assertions on endpoint, toolsets, headers, fail-fast |
| `agent/tests/test_llm_agent.py` (modify) | Backend-switch assertions replacing the stub-count assertion |
| `agent/tests/golden/llm_system_prompt.skeleton.txt` (regenerate) | Byte-pinned prompt framing |
| `agent/.env.example` (modify) | The two new knobs |
| `agent/README.md` (modify) | Run instructions for the two new knobs |

---

### Task 1: Documentation — SPEC.md §3 and the Phase-7 spec

Runs on `main`, before any worktree exists. Spec decision 18: the rewritten beats are what Task 5's live verification runs against, so they must exist first.

**Files:**
- Modify: `SPEC.md:19-33`
- Modify: `_dev/docs/spec/phase-7-agent.md` (scope bullet, decision 7, open items)

**Interfaces:**
- Consumes: nothing.
- Produces: the five repo-named demo beats that Task 5's verification prompts are drawn from.

- [ ] **Step 1: Confirm you are on `main` with a clean tree**

```bash
cd /Users/jiohin/Desktop/future-of-sw/a2ui-github
git branch --show-current   # expect: main
git status --short           # expect: only _dev/TODO.md modified (the [WIP] mark)
```

- [ ] **Step 2: Rewrite `SPEC.md` §3 bullets (lines 21-23)**

Replace these three bullets:

```markdown
- **Anchor flow:** "the maintainer's morning" — PR triage on the real **`a2ui-project/a2ui`** repository.
- **Persona framing:** repo-level **maintainer triage**, **viewer-agnostic** prompts. Not "PRs waiting on my review".
- **Action scope:** **read-only** against the real repo. Write-actions (approve / comment / label) are rendered as **compose-and-confirm** UI that stops short of the real POST — no mutation of the live community repo. (A full read+write loop on a seeded sandbox repo is a possible future upgrade.)
```

with:

```markdown
- **Agent reach:** the agent is a **general GitHub agent** — any public repository, plus the authenticated user's own pull requests, issues, and notifications. **`a2ui-project/a2ui` is the demo subject, not the agent's boundary.**
- **Anchor flow:** "the maintainer's morning" — PR triage on the real **`a2ui-project/a2ui`** repository.
- **Persona framing:** **maintainer triage**, supporting both **repo-level** prompts (which name their repository) and **viewer-centric** prompts ("PRs waiting on my review", "my notifications"), resolved through the authenticated user's identity. A request naming neither a repository nor the viewer scopes to the authenticated user.
- **Action scope:** **read-only** against live GitHub, enforced structurally at both the MCP endpoint and the token. Write-actions (approve / comment / label) are rendered as **compose-and-confirm** UI that stops short of the real POST — no mutation of any live repository. (A full read+write loop on a seeded sandbox repo is a possible future upgrade.)
- **Repository confinement is prompt-level only.** A fine-grained PAT that can read repositories the user does not own must use public-repository read access, which cannot be narrowed to a single repository. The token also grants no access to the user's own private repositories. Read-only makes the blast radius nil.
```

- [ ] **Step 3: Rewrite `SPEC.md` §3.1's five beats (lines 29-33)**

Each beat names its repository, because there is no default repository (spec decision 11). Replace:

```markdown
1. "Show me the open PRs that need review." → triage **list**.
2. "Which of these are failing CI?" → list with **check-status emphasis** (re-composed, not re-skinned).
3. "Ignore the dependabot bumps — what human PRs are waiting?" → **headline fuzzy-intent** moment.
4. "Open #1668." → PR **detail** view (see §3.2).
5. "Draft an approving review saying the heading cleanup looks reasonable." → **compose-and-confirm** action (no POST).
```

with:

```markdown
1. "Show me the open PRs on a2ui-project/a2ui that need review." → triage **list**.
2. "Which of these are failing CI?" → list with **check-status emphasis** (re-composed, not re-skinned).
3. "Ignore the dependabot bumps — what human PRs are waiting?" → **headline fuzzy-intent** moment.
4. "Open a2ui-project/a2ui#1668." → PR **detail** view (see §3.2).
5. "Draft an approving review saying the heading cleanup looks reasonable." → **compose-and-confirm** action (no POST).
```

Beats 2, 3, and 5 are unchanged — they refer back to the subject established by beat 1, which is within-turn reference, not the cross-turn context Phase 8 owns.

- [ ] **Step 4: Update the Phase-7 spec scope bullet**

In `_dev/docs/spec/phase-7-agent.md`, find the first Scope bullet:

```markdown
- A live agent — real LLM, the full Phase-6 catalog, real GitHub data via MCP — that takes a
  natural-language prompt and streams back a valid, rendered surface through the existing client,
  with the event round-trip working (click → agent → new surface).
```

Append a sentence to that bullet:

```markdown
  The agent's reach is general GitHub — any public repository plus the authenticated user's own
  pull requests, issues, and notifications — with `a2ui-project/a2ui` as the demo subject rather
  than a boundary (task 7.3).
```

Also update the phase header sentence (line 3-5) that reads "against the real `a2ui-project/a2ui` repository" to "against live GitHub, demoed on `a2ui-project/a2ui`".

- [ ] **Step 5: Update the Phase-7 spec's decision 7**

Replace the body of `### 7. GitHub MCP — official remote server, read-only enforced below the prompt` with:

```markdown
The official `github/github-mcp-server`, remote hosted variant, plugged into the `LlmAgent` as an
ADK MCP toolset over streamable HTTP. Read-only is enforced twice and independently: the server's
read-only endpoint, so write tools never enter the tool inventory, and a fine-grained PAT carrying
no write permission. Both are required — the `pull_requests` toolset ships write tools in its
unrestricted form, including a review-write tool, which is exactly the capability beat 5 must
structurally lack. Toolsets are pinned explicitly rather than inherited from the server default or
requested as "all", keeping the tool surface reviewable and diffable instead of drifting with the
server's release schedule. The stub toolset is retained behind an environment switch that defaults
to MCP; a missing token fails fast rather than falling back silently. Full wiring is settled in
`_dev/docs/spec/task-7.3-github-mcp-wiring.md`.
```

- [ ] **Step 6: Resolve the open item**

In the Phase-7 spec's `## Open items`, remove `exact MCP toolset names and env wiring (7.3), ` from the deferred list — it is now settled. Leave every other open item untouched.

- [ ] **Step 7: Verify no stale framing remains**

```bash
grep -n "viewer-agnostic" SPEC.md _dev/docs/spec/phase-7-agent.md
```

Expected: no output.

- [ ] **Step 8: Commit (on `main`, stage only these two files)**

```bash
git add SPEC.md _dev/docs/spec/phase-7-agent.md
git commit -m "docs(phase-7): expand agent scope to general GitHub; settle 7.3 MCP wiring"
```

---

### Task 2: The MCP toolset module

**Files:**
- Create: `agent/llm_agent/mcp.py`
- Test: `agent/tests/test_llm_mcp.py`

**Interfaces:**
- Consumes: `google.adk.tools.mcp_tool.McpToolset`, `google.adk.tools.mcp_tool.StreamableHTTPConnectionParams`.
- Produces, for Task 3:
  - `GITHUB_MCP_URL: str`
  - `GITHUB_MCP_TOOLSETS: tuple[str, ...]`
  - `PAT_ENV_VAR: str` (value `"GITHUB_MCP_PAT"`)
  - `MissingGitHubPatError(RuntimeError)`
  - `github_pat() -> str` — raises `MissingGitHubPatError` when unset or empty
  - `mcp_headers(pat: str) -> dict[str, str]`
  - `build_github_toolset() -> McpToolset` — connects lazily; raises `MissingGitHubPatError` when the PAT is missing

- [ ] **Step 1: Create the worktree and rebase**

`_dev/` work is done; everything from here is code. Create the sub-task worktree off `main`:

```bash
cd /Users/jiohin/Desktop/future-of-sw/a2ui-github
git worktree add ../a2ui-github-phase-7-3 -b phase-7/3-github-mcp-wiring main
```

Then invoke the `daily-work-harness:rebase-with-main` skill. All remaining steps run in `../a2ui-github-phase-7-3/agent`.

- [ ] **Step 2: Write the failing test**

Create `agent/tests/test_llm_mcp.py`:

```python
"""Offline assertions on the remote GitHub MCP wiring (task 7.3).

No test here touches the network: McpToolset connects lazily, so construction is
safe, and every other assertion is over constants and header assembly.
"""

import pytest
from google.adk.tools.mcp_tool import McpToolset

from llm_agent.mcp import (
    GITHUB_MCP_TOOLSETS,
    GITHUB_MCP_URL,
    PAT_ENV_VAR,
    MissingGitHubPatError,
    build_github_toolset,
    github_pat,
    mcp_headers,
)


def test_endpoint_is_the_read_only_variant():
    # Read-only layer 1: write tools never enter the inventory. Dropping the
    # /readonly suffix would hand the model merge_pull_request and
    # pull_request_review_write.
    assert GITHUB_MCP_URL == "https://api.githubcopilot.com/mcp/readonly"


def test_toolsets_are_pinned_exactly():
    # Pinned, not inherited from the server default and not "all": the tool
    # surface is a design decision, so it stays diffable.
    assert GITHUB_MCP_TOOLSETS == (
        "context",
        "repos",
        "issues",
        "pull_requests",
        "users",
        "notifications",
    )


def test_pat_env_var_is_dedicated():
    # Deliberately not GITHUB_TOKEN, which CI and the gh CLI inject implicitly.
    assert PAT_ENV_VAR == "GITHUB_MCP_PAT"


def test_github_pat_reads_env(monkeypatch):
    monkeypatch.setenv(PAT_ENV_VAR, "ghp_example")
    assert github_pat() == "ghp_example"


def test_github_pat_missing_fails_fast_naming_both_knobs(monkeypatch):
    monkeypatch.delenv(PAT_ENV_VAR, raising=False)
    with pytest.raises(MissingGitHubPatError) as excinfo:
        github_pat()
    message = str(excinfo.value)
    assert PAT_ENV_VAR in message
    assert "TOOL_BACKEND=stub" in message


def test_github_pat_empty_is_treated_as_missing(monkeypatch):
    monkeypatch.setenv(PAT_ENV_VAR, "")
    with pytest.raises(MissingGitHubPatError):
        github_pat()


def test_headers_carry_bearer_and_pinned_toolsets():
    headers = mcp_headers("ghp_example")
    assert headers["Authorization"] == "Bearer ghp_example"
    assert headers["X-MCP-Toolsets"] == (
        "context,repos,issues,pull_requests,users,notifications"
    )


def test_build_toolset_constructs_offline(monkeypatch):
    monkeypatch.setenv(PAT_ENV_VAR, "ghp_example")
    toolset = build_github_toolset()
    assert isinstance(toolset, McpToolset)


def test_build_toolset_without_pat_fails_fast(monkeypatch):
    monkeypatch.delenv(PAT_ENV_VAR, raising=False)
    with pytest.raises(MissingGitHubPatError):
        build_github_toolset()
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
uv run pytest tests/test_llm_mcp.py -v
```

Expected: collection error, `ModuleNotFoundError: No module named 'llm_agent.mcp'`.

- [ ] **Step 4: Write the implementation**

Create `agent/llm_agent/mcp.py`:

```python
"""Remote GitHub MCP toolset: read-only, explicitly pinned toolsets (task 7.3).

Read-only is enforced twice and independently — the server's read-only endpoint,
so write tools never enter the tool inventory, and a fine-grained PAT carrying no
write permission. Both are required: the `pull_requests` toolset ships
`merge_pull_request` and `pull_request_review_write` in its unrestricted form,
which is precisely the capability the compose-and-confirm beat must lack.

Repository confinement is prompt-level only. A fine-grained PAT that can read
repositories the user does not own must use public-repository read access, which
cannot be narrowed to one repository — and which grants no access to the user's
own private repositories. Read-only makes the blast radius nil.
"""

from __future__ import annotations

import os

from google.adk.tools.mcp_tool import McpToolset, StreamableHTTPConnectionParams

# The read-only variant of the official remote server.
GITHUB_MCP_URL = "https://api.githubcopilot.com/mcp/readonly"

# Pinned explicitly rather than inherited from the server's default set or
# requested as "all": the tool surface is a statement about what the agent is, so
# it stays reviewable and diffable instead of drifting with GitHub's releases.
GITHUB_MCP_TOOLSETS = (
    "context",
    "repos",
    "issues",
    "pull_requests",
    "users",
    "notifications",
)

# Deliberately not GITHUB_TOKEN: GitHub Actions injects that name and the gh CLI
# reads it implicitly, so a stray value could silently shadow this one.
PAT_ENV_VAR = "GITHUB_MCP_PAT"


class MissingGitHubPatError(RuntimeError):
    """Raised when the MCP backend is selected with no PAT configured."""


def github_pat() -> str:
    """Reads the PAT, failing fast rather than degrading to canned data.

    A silent fallback would render a convincing surface from stub fixtures with
    no signal that it is not live, so the stub is only ever a deliberate choice.
    """
    pat = os.environ.get(PAT_ENV_VAR)
    if not pat:
        raise MissingGitHubPatError(
            f"{PAT_ENV_VAR} is not set. The live agent needs a fine-grained "
            "GitHub PAT with read-only access to public repositories; set it in "
            "agent/.env. To run against canned fixture data instead, set "
            "TOOL_BACKEND=stub."
        )
    return pat


def mcp_headers(pat: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {pat}",
        "X-MCP-Toolsets": ",".join(GITHUB_MCP_TOOLSETS),
    }


def build_github_toolset() -> McpToolset:
    """Constructs the read-only GitHub MCP toolset.

    Construction is offline: McpToolset stores its connection parameters and
    builds a session manager, connecting only when its tools are first listed.
    """
    return McpToolset(
        connection_params=StreamableHTTPConnectionParams(
            url=GITHUB_MCP_URL,
            headers=mcp_headers(github_pat()),
        )
    )
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
uv run pytest tests/test_llm_mcp.py -v
```

Expected: 9 passed.

- [ ] **Step 6: Commit**

```bash
git add llm_agent/mcp.py tests/test_llm_mcp.py
git commit -m "feat(phase-7): read-only GitHub MCP toolset with pinned toolsets"
```

---

### Task 3: The `TOOL_BACKEND` switch

**Files:**
- Modify: `agent/llm_agent/agent.py`
- Test: `agent/tests/test_llm_agent.py`

**Interfaces:**
- Consumes from Task 2: `build_github_toolset`, `GITHUB_MCP_URL`, `GITHUB_MCP_TOOLSETS`, `MissingGitHubPatError`.
- Produces:
  - `DEFAULT_BACKEND: str` (value `"mcp"`)
  - `tool_backend() -> str`
  - `build_tools() -> list` — returns `list(STUB_TOOLS)` under `stub`, `[McpToolset]` under `mcp`, raises `ValueError` on any other value
  - `build_llm_agent(model: str | None = None) -> LlmAgent` — unchanged signature

- [ ] **Step 1: Write the failing tests**

Replace the whole of `agent/tests/test_llm_agent.py` with:

```python
import pytest
from a2ui.schema.constants import A2UI_SCHEMA_BLOCK_START
from google.adk.tools.mcp_tool import McpToolset

from llm_agent.agent import (
    DEFAULT_BACKEND,
    DEFAULT_MODEL,
    STUB_TOOLS,
    build_llm_agent,
    build_tools,
    model_name,
    tool_backend,
)
from llm_agent.mcp import PAT_ENV_VAR, MissingGitHubPatError


def test_model_name_defaults_to_cheap_tier(monkeypatch):
    monkeypatch.delenv("MODEL_NAME", raising=False)
    assert model_name() == DEFAULT_MODEL


def test_model_name_reads_env(monkeypatch):
    monkeypatch.setenv("MODEL_NAME", "gemini-1.5-pro")
    assert model_name() == "gemini-1.5-pro"


def test_backend_defaults_to_mcp(monkeypatch):
    # Live is the default so the stub is always a deliberate choice: an
    # accidentally-stubbed verification run is silently wrong, whereas an
    # accidental live run costs only a few API calls.
    monkeypatch.delenv("TOOL_BACKEND", raising=False)
    assert tool_backend() == DEFAULT_BACKEND == "mcp"


def test_backend_reads_env(monkeypatch):
    monkeypatch.setenv("TOOL_BACKEND", "stub")
    assert tool_backend() == "stub"


def test_stub_backend_gives_the_read_only_pair(monkeypatch):
    monkeypatch.setenv("TOOL_BACKEND", "stub")
    tools = build_tools()
    assert {t.__name__ for t in tools} == {"list_pull_requests", "get_pull_request"}


def test_mcp_backend_gives_the_mcp_toolset(monkeypatch):
    monkeypatch.setenv("TOOL_BACKEND", "mcp")
    monkeypatch.setenv(PAT_ENV_VAR, "ghp_example")
    tools = build_tools()
    assert len(tools) == 1
    assert isinstance(tools[0], McpToolset)


def test_mcp_backend_without_pat_fails_fast(monkeypatch):
    monkeypatch.setenv("TOOL_BACKEND", "mcp")
    monkeypatch.delenv(PAT_ENV_VAR, raising=False)
    with pytest.raises(MissingGitHubPatError):
        build_tools()


def test_unknown_backend_is_rejected(monkeypatch):
    monkeypatch.setenv("TOOL_BACKEND", "github")
    with pytest.raises(ValueError) as excinfo:
        build_tools()
    assert "github" in str(excinfo.value)


def test_backend_choice_is_logged(monkeypatch, caplog):
    monkeypatch.setenv("TOOL_BACKEND", "stub")
    with caplog.at_level("INFO", logger="llm_agent.agent"):
        build_tools()
    assert "stub" in caplog.text


def test_build_llm_agent_wires_prompt_and_tools(monkeypatch):
    monkeypatch.setenv("TOOL_BACKEND", "stub")
    a = build_llm_agent(model="gemini-2.5-flash")
    assert a.model == "gemini-2.5-flash"
    # A provider callable, never a plain string: ADK state-templates string
    # instructions, and the prompt's JSON braces would raise KeyError at runtime.
    assert not isinstance(a.instruction, str)
    prompt = a.instruction(None)
    # instruction carries the authored role and the SDK-injected schema block
    assert "GitHub agent" in prompt
    assert A2UI_SCHEMA_BLOCK_START in prompt
    assert len(a.tools) == 2


def test_stub_tools_are_the_read_only_pair():
    names = {t.__name__ for t in STUB_TOOLS}
    assert names == {"list_pull_requests", "get_pull_request"}
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
uv run pytest tests/test_llm_agent.py -v
```

Expected: collection error — `ImportError: cannot import name 'DEFAULT_BACKEND' from 'llm_agent.agent'`.

- [ ] **Step 3: Write the implementation**

Replace `agent/llm_agent/agent.py` in full:

```python
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

# Cheap Gemini tier by default (spec decision 7); overridable via MODEL_NAME.
DEFAULT_MODEL = "gemini-2.5-flash"

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
```

Note the log line is emitted *after* `build_github_toolset()`, so a missing PAT raises before anything claims MCP is active.

- [ ] **Step 4: Run the tests**

```bash
uv run pytest tests/test_llm_agent.py -v
```

Expected: 10 passed, 1 failed — `test_build_llm_agent_wires_prompt_and_tools` fails on `assert "GitHub agent" in prompt`, because `prompt.py` is not generalized until Task 4. This is expected and Task 4 closes it.

- [ ] **Step 5: Commit**

```bash
git add llm_agent/agent.py tests/test_llm_agent.py
git commit -m "feat(phase-7): TOOL_BACKEND switch between MCP and stub, defaulting to MCP"
```

---

### Task 4: Prompt generalization and golden regeneration

**Files:**
- Modify: `agent/llm_agent/prompt.py:10-17` (role), and `build_system_prompt`
- Regenerate: `agent/tests/golden/llm_system_prompt.skeleton.txt`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `SCOPE_DESCRIPTION: str` alongside the existing `ROLE_DESCRIPTION` / `WORKFLOW_DESCRIPTION` / `EXAMPLES_FRAMING`.

- [ ] **Step 1: Generalize `ROLE_DESCRIPTION`**

Replace `agent/llm_agent/prompt.py:10-17` with:

```python
ROLE_DESCRIPTION = (
    "You are a GitHub agent. You turn a natural-language request about GitHub — any public "
    "repository, or the authenticated user's own pull requests, issues, and notifications — "
    "into a single rich A2UI surface rendered in GitHub's Primer design language. You never "
    "answer in prose when a surface would serve the user better: you compose a screen from "
    "the catalog's components and bind it to real data. You read GitHub data through the "
    "provided tools; you never invent PR numbers, titles, authors, or counts — every value "
    "shown on a surface comes from a tool result."
)
```

- [ ] **Step 2: Add `SCOPE_DESCRIPTION`**

Insert immediately after `WORKFLOW_DESCRIPTION` in `agent/llm_agent/prompt.py`:

```python
# Subject resolution (there is no configured default repository) plus tool-call
# economy: a filtered list is one search call, not a list call followed by a
# per-item fan-out that burns the rate limit.
SCOPE_DESCRIPTION = (
    "Resolve the subject of a request before fetching any data. If the request names a "
    "repository, use that repository. If it is about the authenticated user — 'my PRs', "
    "'waiting on my review', 'my notifications' — resolve the viewer's identity through the "
    "tools and scope to them. If it names neither a repository nor the viewer, scope it to "
    "the authenticated user. Ask which repository is meant only when the request is "
    "ambiguous in a way viewer scope cannot resolve. "
    "For a filtered list, prefer a single search call using GitHub search qualifiers — for "
    "example 'is:pr is:open review-requested:@me', 'is:pr is:open status:failure', "
    "'-author:app/dependabot' — over listing everything and then reading each item in turn. "
    "Drilling into one specific pull request is different: fetching its detail, reviews, "
    "comments, status checks, and changed files takes several calls, and that is expected."
)
```

- [ ] **Step 3: Wire `SCOPE_DESCRIPTION` into the assembled prompt**

In `build_system_prompt`, change the `workflow_description` argument from:

```python
        workflow_description=WORKFLOW_DESCRIPTION,
```

to:

```python
        workflow_description="\n\n".join([WORKFLOW_DESCRIPTION, SCOPE_DESCRIPTION]),
```

and update the docstring line `Authored content is only ROLE/WORKFLOW; …` to read `Authored content is only ROLE/WORKFLOW/SCOPE; …`.

- [ ] **Step 4: Run the prompt tests to verify the golden now fails**

```bash
uv run pytest tests/test_llm_prompt.py -v
```

Expected: `test_prompt_skeleton_matches_golden` FAILS — the golden byte-pins the old role text.

- [ ] **Step 5: Regenerate the golden and inspect the diff**

The test re-authors the golden when the file is absent (`tests/test_llm_prompt.py:53-55`):

```bash
rm tests/golden/llm_system_prompt.skeleton.txt
uv run pytest tests/test_llm_prompt.py -v
git diff --stat tests/golden/llm_system_prompt.skeleton.txt
git diff tests/golden/llm_system_prompt.skeleton.txt
```

Expected: tests pass, and the diff shows exactly two changes — the rewritten first line, and the new `SCOPE_DESCRIPTION` paragraph after the workflow paragraph. The three `<<<…>>>` markers must all still be present. If anything else moved, stop and investigate before continuing.

- [ ] **Step 6: Confirm no stale single-repo framing remains in the prompt**

```bash
grep -rn "maintainer's-morning\|about the a2ui-project/a2ui repository" llm_agent/ tests/
```

Expected: no output. (`llm_agent/tools.py` still mentions `a2ui-project/a2ui` in its own docstrings — that is the stub describing its own canned data, and it is deliberately untouched.)

- [ ] **Step 7: Run the whole suite**

```bash
uv run pytest
```

Expected: all pass, including `test_build_llm_agent_wires_prompt_and_tools` from Task 3.

- [ ] **Step 8: Commit**

```bash
git add llm_agent/prompt.py tests/golden/llm_system_prompt.skeleton.txt system_prompt.dump.txt
git commit -m "feat(phase-7): generalize agent role to all of GitHub; add subject-resolution and search-preference rules"
```

---

### Task 5: Configuration docs and live verification

**Files:**
- Modify: `agent/.env.example`
- Modify: `agent/README.md:8-11` and `:37-44`

**Interfaces:**
- Consumes: `PAT_ENV_VAR` from Task 2, `DEFAULT_BACKEND` from Task 3.
- Produces: nothing consumed by later tasks — this is the terminal task.

- [ ] **Step 1: Add the two knobs to `.env.example`**

Append to `agent/.env.example`:

```
# Fine-grained GitHub PAT for the remote GitHub MCP server. Create it under your
# personal account's developer settings with read-only access to public
# repositories, and grant no write permission — read-only is enforced both here
# and by the server's read-only endpoint. Note this token mode reaches every
# public repository but none of your own private ones.
GITHUB_MCP_PAT=your-fine-grained-read-only-pat

# Tool backend: "mcp" (live GitHub, the default) or "stub" (canned fixture data,
# no GitHub calls). The active backend is named in the startup log.
TOOL_BACKEND=mcp
```

- [ ] **Step 2: Update the README's package blurb**

In `agent/README.md`, the `llm_agent/` bullet describes the stub as the shipped toolset. Replace the sentence beginning "Ships with a stub read-only PR toolset (`llm_agent/tools.py`) so its definition of done…" with:

```markdown
  Reads live GitHub through the official remote GitHub MCP server (read-only). A stub
  toolset (`llm_agent/tools.py`) remains available behind `TOOL_BACKEND=stub` for work
  that should not consume GitHub call allowance.
```

- [ ] **Step 3: Update the README's run section**

In the `## Run the live agent (Phase 7)` section, replace the configuration sentence with:

```markdown
Copy `.env.example` to `.env` and set `MODEL_NAME` (a Gemini model; cheap tier by
default), `GOOGLE_API_KEY` (Google AI Studio), and `GITHUB_MCP_PAT` (a fine-grained
GitHub PAT with read-only access to public repositories). The agent fails to start
if `GITHUB_MCP_PAT` is missing while `TOOL_BACKEND` is `mcp` (the default); set
`TOOL_BACKEND=stub` to run against canned fixture data instead. Then:
```

- [ ] **Step 4: Verify the suite is still green and still offline**

```bash
uv run pytest
```

Expected: all pass. Confirm the run needs no `GOOGLE_API_KEY`, no `GITHUB_MCP_PAT`, and no network — the README's L0 promise.

- [ ] **Step 5: Commit**

```bash
git add .env.example README.md
git commit -m "docs(phase-7): document GITHUB_MCP_PAT and TOOL_BACKEND"
```

- [ ] **Step 6: Live verification — driven by the user, not automated**

This is the task's definition of done and cannot be run by an agent: it needs a real PAT and a browser. Report to the user that the code is ready and hand over these steps.

Per `CLAUDE.md` §"Local testing in a tunnel environment", both ports must be forwarded **public**, and every browser-facing URL is a tunnel URL.

1. Put a real fine-grained PAT in `agent/.env` as `GITHUB_MCP_PAT`.
2. Start the agent, advertising its tunnel URL:
   ```bash
   uv run python -m llm_agent --host localhost --port 10003 --base-url https://vnw20xbg-10003.asse.devtunnels.ms
   ```
   Confirm the startup log reads `tool backend: mcp — https://api.githubcopilot.com/mcp/readonly, toolsets=context,repos,issues,pull_requests,users,notifications`.
3. Start the client with `VITE_A2A_SERVER_URL` set to the agent's tunnel URL.
4. Drive **both** proof prompts through the chat shell — one per resolution path:
   - Repo-named: `Show me the open PRs on a2ui-project/a2ui that need review.`
   - Viewer-scoped: `What PRs are waiting on my review?`
5. For each, confirm a surface renders and its values are real — cross-check a PR number and title against github.com.

- [ ] **Step 7: Record the bloat measurement**

Spec decision 15: 7.3 measures response size, and mitigates only if the measurement demands it. While the live runs are in flight, capture from the agent log how large the MCP tool results are — particularly a PR-detail drill, which fans across `get`, `get_reviews`, `get_comments`, `get_status`/`get_check_runs`, and `get_files`.

Report the observation to the user. If a single result is large enough to threaten the context budget, that is the trigger for a projecting wrapper tool — a follow-up within 7.3, planned then, with the number in hand. If it is comfortable, record that and add nothing.

---

## Self-Review

**Spec coverage.** Decisions 1-4 → Task 2 (endpoint, pinned toolsets, both read-only layers). 5-7 → Task 2 (`GITHUB_MCP_PAT`, fail-fast) and Task 5 (limitations documented). 8 → Task 3 (switch, default, log line). 9 → no task touches the stub; Task 4 Step 6 explicitly protects its docstrings. 10-13 → Task 1 (SPEC framing) and Task 4 (`ROLE_DESCRIPTION`, `SCOPE_DESCRIPTION`). 14 → Task 4 Step 2. 15 → Task 5 Step 7. 16-17 → Task 5 Step 6. 18 → Task 1.

**Type consistency.** `build_tools()` returns a `list`, holding either the two stub callables or one `McpToolset` — asserted both ways in Task 3. `github_pat()`, `mcp_headers()`, `build_github_toolset()`, `MissingGitHubPatError`, `PAT_ENV_VAR`, `GITHUB_MCP_URL`, and `GITHUB_MCP_TOOLSETS` are defined in Task 2 and imported under exactly those names in Task 3. `GITHUB_MCP_TOOLSETS` is a tuple everywhere and is `","`-joined at both use sites.

**Known cross-task failure.** Task 3 Step 4 leaves `test_build_llm_agent_wires_prompt_and_tools` red on the `"GitHub agent"` assertion until Task 4 rewrites `ROLE_DESCRIPTION`. This is called out in both tasks so a reviewer gating Task 3 does not read it as a defect.

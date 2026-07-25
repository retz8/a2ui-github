# Task 7.3 — GitHub MCP wiring

Re-points the proven tool→surface path from the stub toolset to the official remote GitHub MCP
server, and expands the agent from a single-repository agent into a general GitHub agent. Parent:
`_dev/TODO.md` 7.3; `_dev/docs/spec/phase-7-agent.md` decision 7; SPEC.md §3.

## Scope

- The MCP transport, toolset selection, auth, and backend switch that replace the stub as the
  agent's live data source.
- The scope expansion from "the a2ui-project/a2ui agent" to a general GitHub agent, including the
  viewer-centric capability that expansion unlocks.
- Prompt changes that follow from the expansion and from tool-call economy.
- The documentation changes the expansion forces — SPEC.md, the Phase-7 spec, and this task's plan
  doc — all written before implementation.
- Out of scope: growing the stub toolset, beat-by-beat surface quality (7.7), and any record/replay
  or scenario-runner machinery (7.5 / 7.6).

## Locked decisions

### 1. MCP as the transport

The official remote GitHub MCP server is the tool transport, over the `gh` CLI or hand-authored REST
tools. The deciding factors are zero tool-authoring — the server ships tool schemas and descriptions,
which would otherwise become prompt surface to tune — and an inventory-level read-only guarantee.
Response bloat is the accepted cost of the choice.

### 2. Server endpoint and auth

The remote server's read-only variant is the endpoint, with the personal access token passed as a
bearer credential.

### 3. Explicitly pinned toolsets

Toolsets are `context`, `repos`, `issues`, `pull_requests`, `users`, and `notifications`, listed
explicitly rather than inherited from the server's default set or requested as "all". Pinning keeps
the agent's tool surface deterministic, reviewable, and diffable rather than drifting with the
server's release schedule. The list is a module constant, not an environment knob — the tool surface
is a statement about what the agent is, not deployment configuration.

### 4. Two independent read-only layers

Read-only is enforced twice: by the server's read-only variant, so write tools never enter the
inventory, and by the token, which carries no write permission. Both are required — the
`pull_requests` toolset ships write tools in its unrestricted form, including a review-write tool,
which is exactly the capability beat 5 must structurally lack.

### 5. Token configuration

A fine-grained personal access token created under the personal account, granted read-only access to
public repositories. It is carried in a dedicated environment variable of its own rather than any
conventionally-named GitHub token variable, which tooling elsewhere can inject or shadow.

### 6. Accepted token limitations

Two limits are accepted and are to be written down rather than left implied: the chosen token mode
grants no access to the user's own private repositories, and repository confinement cannot be made
structural for repositories the user does not own — the agent's repository scoping is prompt-level
only. The Phase-7 read-only invariant claims only read-only, never repository confinement.

### 7. Fail fast on a missing token

With the MCP backend selected and no token present, the agent fails at startup with a message naming
both the missing variable and the stub backend. It never falls back to the stub silently — a
silently-stubbed run produces a convincing surface built from canned data with no signal that it is
not live.

### 8. Env-switched backend, defaulting to MCP

A `TOOL_BACKEND` environment knob selects between the MCP toolset and the stub, defaulting to MCP,
with the active backend named in a log line at agent build. The stub is retained so testing and
manual client work need not consume GitHub MCP call allowance. Defaulting to MCP means the stub is
always a deliberate choice: the symmetric mistake — accidentally hitting live GitHub during a test
run — costs a few API calls, whereas an accidentally-stubbed verification run is silently wrong.

### 9. The stub is untouched

The existing stub toolset stays exactly as it is. 7.3 does not re-record its fixtures, mirror MCP
tool signatures, or extend its coverage; it touches the stub only through the backend switch and the
startup wiring.

### 10. General GitHub agent

The agent is no longer limited to a2ui-project/a2ui. Any public repository is reachable;
a2ui-project/a2ui remains the demo subject, not a boundary.

### 11. No default repository

There is no configured default repository — the repository is resolved from the prompt. SPEC's demo
beats are rewritten to name their repository rather than a default being introduced to keep them
answerable as written.

### 12. Viewer-centric capability

Prompts about the authenticated user — their pull requests, issues, and notifications — resolve
through the viewer identity available in the `context` toolset. This overturns SPEC §3's
viewer-agnostic persona framing, which existed as a consequence of the repository pinning rather
than as an independent conviction. Repository-level triage remains fully supported.

### 13. Unqualified requests default to viewer scope

A request naming neither a repository nor the viewer scopes to the authenticated user, matching how
GitHub itself behaves when logged in. This is a preference rather than an absolute: the agent may
still ask when a request is ambiguous in a way viewer scope cannot resolve. A clarification surface
as the standard path is a Phase-8 expansion.

### 14. Search-preference steering in the prompt

The prompt steers toward search tools with GitHub search qualifiers for filtered lists, rather than
listing and then reading each item — the latter turns a single filtered list into a per-item fan-out
against the rate limit. The multi-call drill into a single pull request's detail is correct behavior
and is left alone.

### 15. Bloat is measured before it is mitigated

Response size is observed during 7.3 against real payloads. A projecting wrapper tool is introduced
only if the measurement demands one; mitigation authored before measurement would be guesswork. Both
the observation and any resulting fix belong to 7.3.

### 16. Definition of done is a live manual run

7.3 is done when a live-data surface renders through the client over the dev tunnel with ports
public. No live test enters the automated suite — the suite stays zero-LLM and token-free as its
README promises, and live scenario running is 7.6's purpose. Automated coverage asserts wiring only,
which is possible offline because the MCP toolset connects lazily.

### 17. Two proof prompts

The live proof exercises both resolution paths introduced by the expansion: one repository-named
prompt against a2ui-project/a2ui, and one viewer-scoped prompt. Beat-by-beat verification proper
remains 7.7's.

### 18. Documentation lands first, inside 7.3

SPEC.md, the Phase-7 spec, and this task's plan doc are all updated within 7.3, before
implementation — the rewritten beats are what the live proof runs against. SPEC.md §3 reframes the
anchor flow as the demo subject rather than the agent's boundary, inverts the viewer-agnostic
framing, and names the repository in each of the five beats. The Phase-7 spec generalizes its scope
statement, absorbs the settled wiring into decision 7, and drops its resolved open item on MCP
toolset names and env wiring.

## Invariants

- Read-only remains structural, enforced independently at both the server and the token.
- The scope expansion changes the agent's reach, not its action scope: write intents still resolve
  only to rendered surfaces.

## Open items

- Whether the stub toolset needs to grow — raised during implementation if the need appears, not
  designed in advance.
- Whether a projecting wrapper tool is needed for response bloat — contingent on the measurement in
  decision 15.

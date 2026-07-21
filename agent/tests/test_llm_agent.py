from a2ui.schema.constants import A2UI_SCHEMA_BLOCK_START

from llm_agent.agent import DEFAULT_MODEL, STUB_TOOLS, build_llm_agent, model_name


def test_model_name_defaults_to_cheap_tier(monkeypatch):
    monkeypatch.delenv("MODEL_NAME", raising=False)
    assert model_name() == DEFAULT_MODEL


def test_model_name_reads_env(monkeypatch):
    monkeypatch.setenv("MODEL_NAME", "gemini-1.5-pro")
    assert model_name() == "gemini-1.5-pro"


def test_build_llm_agent_wires_prompt_and_tools():
    a = build_llm_agent(model="gemini-2.5-flash")
    assert a.model == "gemini-2.5-flash"
    # instruction carries the authored role and the SDK-injected schema block
    assert "maintainer's-morning agent" in a.instruction
    assert A2UI_SCHEMA_BLOCK_START in a.instruction
    # both stub tools registered, no write tool
    assert len(a.tools) == 2


def test_stub_tools_are_the_read_only_pair():
    names = {t.__name__ for t in STUB_TOOLS}
    assert names == {"list_pull_requests", "get_pull_request"}

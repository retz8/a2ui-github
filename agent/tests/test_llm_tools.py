from llm_agent.tools import STUB_TOOLS, get_pull_request, list_pull_requests


def test_list_returns_open_prs_with_bindable_fields():
    prs = list_pull_requests()
    assert prs and all(pr["state"] == "open" for pr in prs)
    first = prs[0]
    for key in ("number", "title", "user", "labels", "html_url"):
        assert key in first
    assert "login" in first["user"]


def test_list_state_all_returns_everything():
    assert len(list_pull_requests(state="all")) >= len(list_pull_requests())


def test_get_returns_detail_for_a_known_pr():
    pr = get_pull_request(231)
    assert pr["number"] == 231
    for key in ("body", "head", "base", "additions", "deletions", "changed_files"):
        assert key in pr


def test_get_unknown_pr_returns_error():
    assert "error" in get_pull_request(999999)


def test_stub_tools_are_read_only_pair():
    assert STUB_TOOLS == [list_pull_requests, get_pull_request]

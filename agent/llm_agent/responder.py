"""LLM responder abstraction: streams model text tokens; ADK-backed at runtime.

The executor depends only on the LlmResponder protocol, so its stream/validate/retry
logic is L0-testable with a fake responder — no live model. AdkLlmResponder is the
real implementation wired by the server; it is exercised by the task's manual live run.
"""

from __future__ import annotations

from typing import AsyncIterator, Optional, Protocol, runtime_checkable


@runtime_checkable
class LlmResponder(Protocol):
    def stream(
        self, prompt: str, correction: Optional[str] = None
    ) -> AsyncIterator[str]:
        """Yields raw model text tokens for `prompt`.

        When `correction` is set, it is a validation-error message appended to the
        same conversation so the model can repair its previous A2UI output.
        """
        ...


class AdkLlmResponder:
    """Runs the live LlmAgent through an ADK Runner with in-memory services."""

    def __init__(self, llm_agent=None, app_name: str = "a2ui_github_live"):
        from google.adk.artifacts import InMemoryArtifactService
        from google.adk.memory import InMemoryMemoryService
        from google.adk.runners import Runner
        from google.adk.sessions import InMemorySessionService

        from llm_agent.agent import build_llm_agent

        self._app_name = app_name
        self._agent = llm_agent or build_llm_agent()
        self._session_service = InMemorySessionService()
        self._runner = Runner(
            app_name=app_name,
            agent=self._agent,
            session_service=self._session_service,
            artifact_service=InMemoryArtifactService(),
            memory_service=InMemoryMemoryService(),
        )
        self._user_id = "live-user"
        self._session_id: Optional[str] = None

    async def stream(
        self, prompt: str, correction: Optional[str] = None
    ) -> AsyncIterator[str]:
        from google.genai import types as genai_types

        # A None correction marks a fresh request (the executor's first attempt); start a
        # new session so independent requests don't leak conversation state into each
        # other. A retry (correction set) continues the same session so the model sees
        # its previous output and the validation error.
        if correction is None:
            self._session_id = None
        if self._session_id is None:
            session = await self._session_service.create_session(
                app_name=self._app_name, user_id=self._user_id
            )
            self._session_id = session.id

        text = correction if correction is not None else prompt
        message = genai_types.Content(
            role="user", parts=[genai_types.Part(text=text)]
        )
        async for event in self._runner.run_async(
            user_id=self._user_id,
            session_id=self._session_id,
            new_message=message,
        ):
            content = getattr(event, "content", None)
            if content and getattr(content, "parts", None):
                for part in content.parts:
                    chunk = getattr(part, "text", None)
                    if chunk:
                        yield chunk

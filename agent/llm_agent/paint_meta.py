"""Paint-meta shell layer (task 8.5): the <paint-title> tag -> paintMeta DataPart bridge.

The canvas shell wants a per-paint human title and a question marker on the wire
(phase-8 decisions 8 and task-8.5). A2UI v0.9 messages are sealed
(additionalProperties: false), so both ride OUTSIDE the protocol, as a dedicated
shell-metadata DataPart -- `{"paintMeta": {surfaceId, title, kind?}}` under its own
MIME type -- emitted ahead of the createSurface it names. The model sources them as
a tagged element in its prose, before the surface's <a2ui-json> block:

    <paint-title surface="pr-detail-2251" kind="question">Confirm repository</paint-title>

Titles are best-effort (no tag -> no part -> the client's cause-derived fallback);
the question marker is not: kind="question" and a ConfirmationDialog root imply each
other, enforced by validate_question_markers through the correction/retry loop. That
consistency is THIS agent's policy (Primer's question idiom), not a canvas invariant
-- the client routes on the marker alone.
"""

from __future__ import annotations

import logging
import re

from a2a.types import DataPart, Part

logger = logging.getLogger(__name__)

# The shell-metadata DataPart's MIME tag. Distinct from the A2UI parts' MIME and from
# their inline `version` field, so neither side's A2UI extraction can confuse the two.
PAINT_META_MIME = "application/json+a2ui-shell"
QUESTION_KIND = "question"
QUESTION_ROOT_COMPONENT = "ConfirmationDialog"

_TAG_RE = re.compile(r"<paint-title\b([^>]*)>(.*?)</paint-title>", re.DOTALL)
_ATTR_RE = re.compile(r'([a-zA-Z-]+)\s*=\s*"([^"]*)"')
_OPEN_PREFIX = "<paint-title"


def create_paint_meta_part(meta: dict) -> Part:
    """The paintMeta shell DataPart, as it rides the A2A stream."""
    return Part(
        root=DataPart(data={"paintMeta": meta}, metadata={"mimeType": PAINT_META_MIME})
    )


def _parse_tag(attr_text: str, inner: str) -> dict | None:
    """A completed tag's paintMeta dict, or None when it names no surface."""
    attrs = dict(_ATTR_RE.findall(attr_text))
    surface_id = attrs.get("surface")
    if not surface_id:
        logger.debug("dropped a <paint-title> tag with no surface attribute")
        return None
    meta: dict = {"surfaceId": surface_id}
    title = " ".join(inner.split())
    if title:
        meta["title"] = title
    kind = attrs.get("kind")
    if kind:
        meta["kind"] = kind
    return meta


def _possible_tag_start(text: str) -> int:
    """Index of the earliest suffix that could still become a <paint-title> tag
    (a partial opener at a chunk boundary, or an open tag whose close has not
    streamed yet); len(text) when nothing needs holding back."""
    idx = text.find("<")
    while idx != -1:
        rest = text[idx:]
        if rest.startswith(_OPEN_PREFIX) or _OPEN_PREFIX.startswith(rest):
            return idx
        idx = text.find("<", idx + 1)
    return len(text)


class PaintTitleTagFilter:
    """Streaming filter: strips complete <paint-title> tags out of prose chunks.

    feed() returns (clean_text, metas): the chunk's prose with tags removed, plus one
    meta dict per tag completed by this chunk. Text that could still become a tag is
    held back until it resolves — a lone '<' releases as soon as the next characters
    rule the tag out; an open tag holds until its close arrives (its inner text is
    the title and never reaches the prose channel). flush() releases whatever never
    resolved, so a truncated stream loses no prose.
    """

    def __init__(self) -> None:
        self._buffer = ""

    def feed(self, text: str) -> tuple[str, list[dict]]:
        self._buffer += text
        out: list[str] = []
        metas: list[dict] = []
        while True:
            match = _TAG_RE.search(self._buffer)
            if not match:
                break
            out.append(self._buffer[: match.start()])
            meta = _parse_tag(match.group(1), match.group(2))
            if meta:
                metas.append(meta)
            self._buffer = self._buffer[match.end() :]
        held_at = _possible_tag_start(self._buffer)
        out.append(self._buffer[:held_at])
        self._buffer = self._buffer[held_at:]
        return "".join(out), metas

    def flush(self) -> str:
        held, self._buffer = self._buffer, ""
        return held


def validate_question_markers(payload: list[dict], metas: dict[str, dict]) -> None:
    """Marker <-> dialog consistency (task-8.5 decision 6), per created surface.

    Runs after validate_surface, feeding the same correction/retry loop: a surface
    declared kind="question" must have a ConfirmationDialog root, and a
    ConfirmationDialog-rooted surface must be declared a question. Raises ValueError
    naming the fix.
    """
    created: list[str] = []
    roots: dict[str, str | None] = {}
    for message in payload:
        if not isinstance(message, dict):
            continue
        create = message.get("createSurface")
        if isinstance(create, dict) and isinstance(create.get("surfaceId"), str):
            created.append(create["surfaceId"])
        update = message.get("updateComponents")
        if isinstance(update, dict):
            surface_id = update.get("surfaceId")
            for component in update.get("components") or []:
                if isinstance(component, dict) and component.get("id") == "root":
                    roots[surface_id] = component.get("component")
    for surface_id in created:
        declared = (metas.get(surface_id) or {}).get("kind") == QUESTION_KIND
        root = roots.get(surface_id)
        is_dialog = root == QUESTION_ROOT_COMPONENT
        if declared and not is_dialog:
            raise ValueError(
                f"surface '{surface_id}' is declared kind=\"question\" in its "
                f"<paint-title> tag but its root component is {root!r}, not "
                f"'{QUESTION_ROOT_COMPONENT}'. A question surface must have a "
                f"{QUESTION_ROOT_COMPONENT} root; either compose the question as a "
                f"{QUESTION_ROOT_COMPONENT} or drop the kind attribute."
            )
        if is_dialog and not declared:
            raise ValueError(
                f"surface '{surface_id}' has a '{QUESTION_ROOT_COMPONENT}' root but is "
                'not declared kind="question". A question surface must be declared: '
                f'emit <paint-title surface="{surface_id}" kind="question">…'
                "</paint-title> before its <a2ui-json> block."
            )

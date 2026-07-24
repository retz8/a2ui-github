import logging
from pathlib import Path

import click
import uvicorn
from dotenv import load_dotenv

from llm_agent.server import DEFAULT_PORT, build_app

# Debug aid: timestamped logs so request/model/stream ordering is unambiguous.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s.%(msecs)03d %(levelname)s %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)

# agent/.env (see .env.example) supplies MODEL_NAME / GOOGLE_API_KEY; anchored to the
# project dir so the entrypoint works from any cwd. Real env vars take precedence.
load_dotenv(Path(__file__).resolve().parent.parent / ".env")


@click.command()
@click.option("--host", default="localhost")
@click.option("--port", default=DEFAULT_PORT)
@click.option(
    "--base-url",
    default=None,
    help=(
        "Public URL to advertise in the agent card (e.g. a devtunnel URL). "
        "Defaults to http://<host>:<port>. Set this when the client reaches the "
        "server through a tunnel/proxy so message/send targets the public URL."
    ),
)
def main(host: str, port: int, base_url: str | None) -> None:
    # log_config=None: let uvicorn's loggers propagate to the timestamped root handler.
    uvicorn.run(build_app(host, port, base_url), host=host, port=port, log_config=None)


if __name__ == "__main__":
    main()

import click
import uvicorn

from deterministic_agent.server import DEFAULT_PORT, build_app


@click.command()
@click.option("--host", default="localhost")
@click.option("--port", default=DEFAULT_PORT)
def main(host: str, port: int) -> None:
    uvicorn.run(build_app(host, port), host=host, port=port)


if __name__ == "__main__":
    main()

from tests.helpers import run_executor


async def test_executor_echoes_component_free_proof_of_receipt():
    payload = await run_executor({"name": "anything", "surfaceId": "s1", "context": {}})
    assert payload == [
        {
            "version": "v0.9",
            "updateDataModel": {"surfaceId": "s1", "path": "/received", "value": True},
        }
    ]

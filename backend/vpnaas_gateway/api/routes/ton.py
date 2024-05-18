from fastapi import APIRouter
from starlette.websockets import WebSocket

from vpnaas_gateway.api.ansible.runner import AnsibleRunner
from vpnaas_gateway.api.ton.auth import TonClient

from pytoniq import LiteClient


ton_router = APIRouter(
    prefix='/ton',
    tags=['TON']
)


@ton_router.get('/test')
async def test():
    """"""
    client = LiteClient.from_testnet_config(trust_level=1)
    await client.connect()
    response = await client.run_get_method(address='EQCEJmk376Dm1RrGb4kMDOBY-KJ-1K5-BPflC5t0XAcGoHFW', method='certificate', stack=[])

    print(response)

    return {}


@ton_router.websocket('/transact/')
async def get_link(
    websocket: WebSocket,
):
    """Method that returns authentication link to user"""
    ton_client = TonClient()
    auth_link = await ton_client.generate_link()
    await websocket.accept()
    await websocket.send_json(data={'auth_link': auth_link})
    print('Auth link has sent to user')
    await ton_client.wait_for_connection()
    print('User successfully authenticated using TonKeeper')
    await websocket.send_json(data={'auth': True})
    print('waited')
    await ton_client.start_transaction()
    print('started')
    ansible_runner = AnsibleRunner()

    # Initialize transaction to

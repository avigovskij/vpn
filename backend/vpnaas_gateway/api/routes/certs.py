from fastapi import APIRouter

from vpnaas_gateway.api.config import VPN_GW_CONFIG


certs_router = APIRouter(
    prefix='/certs',
    tags=['CERTS']
)


@certs_router.post('/')
async def create_new_certificate():
    """Method that reads tasks allowing `state` parameter as filter"""
    return {**VPN_GW_CONFIG}

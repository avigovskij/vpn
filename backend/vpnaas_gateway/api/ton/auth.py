from datetime import datetime

from tonsdk.utils import Address
from vpnaas_gateway.api.config import VPN_GW_CONFIG
from pytonconnect import TonConnect


class TonClient:
    """Class that resolves logic of connction to TON"""

    def _get_wallet_system_by_name(self, name: str):
        """Method that resolves payment system for TON"""
        wanted_wallet = None
        for wallet in self._wallets:
            if wallet['name'] == name:
                wanted_wallet = wallet

        return wanted_wallet

    def _load_wallet_systems(self):
        """Method that loads wallet systems from TON"""
        return self._connector.get_wallets()

    def __init__(self):
        """Initialize method"""
        self._connector = TonConnect(manifest_url=VPN_GW_CONFIG['ton_connect_manifest'])
        self._owner_walet_mnemonic = VPN_GW_CONFIG['mnemonics']
        self._master_smart_contract_address = Address("EQDQcc9nqlxR2D8xMP-qNTEOfY3Qjbb2wRezrc_zqlmU4OdS")
        self._wallets = self._load_wallet_systems()
        self._target_wallet_system = self._get_wallet_system_by_name('Tonkeeper')

    async def generate_link(self) -> str:
        """
        Method that returns link on wallet authentication
        """
        generated_url = await self._connector.connect(self._target_wallet_system)

        return generated_url

    async def wait_for_connection(self):
        """"""
        await self._connector.wait_for_connection()
        self._client_address = Address(self._connector.account.address).to_string(True, True, True)

    async def start_transaction(self):
        """Method that processes payment transaction from user"""
        transaction_payload = {
            "valid_until": int(datetime.now().timestamp()) + 900,
            "messages": [
                {
                    "address": "EQDQcc9nqlxR2D8xMP-qNTEOfY3Qjbb2wRezrc_zqlmU4OdS",
                    "amount": "1",
                },
            ],
        }

        result = await self._connector.send_transaction(transaction_payload)

        print(result)
        return result


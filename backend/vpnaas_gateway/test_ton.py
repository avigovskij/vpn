import asyncio
import base64
import logging
from typing import List

from pytoniq_core import Address, Slice, Cell, MessageAny, begin_cell, TlbScheme

from pytoniq import LiteBalancer, WalletV4R2, LiteClient
from pytoniq_core.boc.deserialize import Boc

mnemonics = [
    "cram", "wish", "unfair", "penalty", "grace", "build", "burst", "bubble", "lecture", "demise", "fragile",
    "lizard", "hedgehog", "sock", "saddle", "erode", "bird", "evoke", "diamond", "blush", "latin", "number", "party",
    "then"
]


class OVPNFile(TlbScheme):
    """"""
    def __init__(self, owner: Address):
        self.type_ = "OVPNFile"
        self.content = "test_content"
        self.owner = owner


async def main():
    # logging.basicConfig(level=logging.INFO)
    client = LiteBalancer.from_testnet_config(trust_level=1)

    owner_address = Address("0QAJRIMrhJRFkiS1hmmfKdZCsPhuBcZBzgpaOizB4o97lLJg")
    master_smart_contract_address = Address("UQDPr9Mf8l8GbBnHt2XEMu8bfNypxJN9Gm4KllQ4SHs1MP4W")

    await client.start_up()
    owner_wallet = await WalletV4R2.from_mnemonic(provider=client, mnemonics=mnemonics)

    await owner_wallet.transfer(
        destination=master_smart_contract_address,
        amount=1000000000,
        body="ovpn_request"
    )

    # master_smart_contract_wallet = await WalletV4R2.from_address(provider=client, address=master_smart_contract_address)
    #
    # result = await master_smart_contract_wallet.run_get_method(
    #     method='subContractAddressByUserAddress',
    #     stack=[owner_address.to_cell().begin_parse()]
    # )
    #
    # print(f"result: {result}")


    # OVPNFile: 0x7362d09c - 1935855772 begin_cell().store_uint(1935855772, 32).store_uint(13, 64).store_bool(True).store_address(owner_address).end_cell()
    # Test: 0x7362d99c - 1935858076

    # data = ''
    # with open("./test.ovpn", "r") as ovpn_file:
    #     data = base64.b64encode(ovpn_file.read().encode()).decode()
    # print(data)
    # await owner_wallet.transfer(
    #     destination=master_smart_contract_address,
    #     amount=1000000000,
    #     body=begin_cell().store_uint(1935855772, 32).store_ref(begin_cell().store_snake_string(data).end_cell()).store_address(owner_address).end_cell(),
    # )

    # await owner_wallet.transfer(
    #     destination=master_smart_contract_address,
    #     amount=10000000,
    #     body=begin_cell().store_uint(2883485651, 32).store_snake_string("test content as snake").store_address(owner_address).end_cell()
    # )

    # print(result)
    # subcontract_address = result[0].load_address()
    # print(f'subcontract address: {subcontract_address}')

    # subcontract = await WalletV4R2.from_address(provider=client, address=subcontract_address)
    # ovpn_content: List[Slice] = await subcontract.run_get_method(method='isResolved', stack=request_stack)
    # if ovpn_content[1]:
    #     print(f'ovpn_content: {ovpn_content[1][0].load_snake_string()}')
    # else:
    #     print(f'ovpn_content is empty: {ovpn_content}')

if __name__ == '__main__':
    asyncio.run(main())

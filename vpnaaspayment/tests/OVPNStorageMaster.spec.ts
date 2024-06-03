import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, ExternalAddress, toNano } from '@ton/core';
import { OVPNStorageMaster, ExternalOVPNFile, InternalOVPNFile } from '../wrappers/OVPNStorageMaster';
import { OVPNStorageEntry } from '../build/OVPNStorageMaster/tact_OVPNStorageEntry';

import '@ton/test-utils';

describe('OVPNStorageMaster', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let ovpnMaster: SandboxContract<OVPNStorageMaster>;
    let ovpnClient: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        ovpnMaster = blockchain.openContract(await OVPNStorageMaster.fromInit(10000n));

        deployer = await blockchain.treasury('deployer');

        ovpnClient = await blockchain.treasury('ovpn_client');

        const deployResult = await ovpnMaster.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
    });
    it('Send request on OVPN file generation', async () => {
        ovpnClient = await blockchain.treasury('ovpn_client');
        let result = await ovpnMaster.send(
            ovpnClient.getSender(),
            {
                value: toNano('10000'),
            },
            'ovpn_request'
        );
        // console.log(result);
        let deployedContractAddress: Address | null  = (await ovpnMaster.getSubContractAddressByUserAddress(ovpnClient.address));
        console.log(`deployedContractAddress: ${deployedContractAddress}`);
        expect(deployedContractAddress != null);

        let deployedContract: SandboxContract<OVPNStorageEntry> = await blockchain.openContract(OVPNStorageEntry.fromAddress(deployedContractAddress!))

        await ovpnMaster.send(
            deployer.getSender(),
            {
                value: toNano('10000'),
            },
            {"$$type": "ExternalOVPNFile", content: "test_message", owner: ovpnClient.address}
        )

        console.log(`OVPNFile from deployed contract getter: ${await deployedContract.getOvpnFile()}`);

        // const ovpnFile: OVPNFile = {
        //     $$type: "OVPNFile",
        //     content: 'test ovpn file content',
        //     owner: ovpnClient.address
        // };
        // await ovpnMaster.send(
        //     deployer.getSender(),
        //     {
        //         value: toNano('0.2')
        //     },
        //     ovpnFile
        // );
        // console.log(`isResolved: ${(await deployedContract.getIsResolved())?.content}`);
    });
    // it('Place .ovpn content into entry', async () => {
    //     const ovpnFile: OVPNFile = {
    //         $$type: "OVPNFile",
    //         content: 'test ovpn file content',
    //         owner: ovpnClient.address
    //     };
    //     await ovpnMaster.send(
    //         deployer.getSender(),
    //         {
    //             value: toNano('0.02')
    //         },
    //         ovpnFile
    //     );

    // });
    // it('Check if OVPN request smart contract contains information about ovpn entry', async () => {
    //     let contract = await blockchain.openContract(OVPNStorageEntry.fromAddress(await ovpnMaster.getOvpnEntry(ovpnClient.address)));
    //     console.log(await contract.getIsResolved());
    // });
});

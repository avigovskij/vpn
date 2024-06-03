import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { OvpnJetton } from '../wrappers/OvpnJetton';
import '@ton/test-utils';

describe('OvpnJetton', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let ovpnJetton: SandboxContract<OvpnJetton>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        ovpnJetton = blockchain.openContract(await OvpnJetton.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await ovpnJetton.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: ovpnJetton.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and ovpnJetton are ready to use
    });
});

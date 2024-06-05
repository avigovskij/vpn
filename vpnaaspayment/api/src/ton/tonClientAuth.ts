import { WebSocket } from 'ws';
import TonConnect, { TonConnectError, IStorage, WalletInfo, isWalletInfoRemote } from '@tonconnect/sdk';
import { v4 as uuid4 } from 'uuid';
import { beginCell, toNano } from '@ton/ton'


// Define local storage to emulate browser environment
// TODO: Move from localstorage to REDIS
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage(`./scratch-${uuid4()}`);


const authAndSendPaymentTransaction = async (wsClient: WebSocket) => {
    const tonConnectClient: TonConnect = new TonConnect({
        manifestUrl: "https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect-manifest.json",
        storage: localStorage
    });

    const walletList: WalletInfo[] = await tonConnectClient.getWallets();

    const tonKeeperClient: WalletInfo = walletList.filter((wallet) => wallet.appName === "tonkeeper")[0];

    let authLink: any = null;

    if (isWalletInfoRemote(tonKeeperClient)) {
        authLink = await tonConnectClient.connect({
            universalLink: tonKeeperClient.universalLink,
            bridgeUrl: tonKeeperClient.bridgeUrl
        }, {tonProof: uuid4()});
    }
    else {
        throw new Error(`${tonKeeperClient} is not remote!`);
    }

    console.log(authLink);
    wsClient.send(JSON.stringify({"auth_link": authLink}));

    tonConnectClient.onStatusChange(async wallet => {
        if (wallet && tonConnectClient.connected) {
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                    messages: [{
                        address: "EQDQcc9nqlxR2D8xMP-qNTEOfY3Qjbb2wRezrc_zqlmU4OdS",
                        amount: toNano(0.05).toString(),
                        payload: beginCell().storeUint(0, 32).storeStringTail("ovpn_request").endCell().toBoc().toString("base64")
                    }]
                }
            let tr = await tonConnectClient.sendTransaction(transaction);
            console.log(tr);
        }
    });
}


export { authAndSendPaymentTransaction };

import { TonClient, WalletContractV4, internal, toNano } from "@ton/ton";
import { mnemonicNew, mnemonicToWalletKey, mnemonicToSeed, mnemonicToPrivateKey } from "ton-crypto";

import CONFIG from "../config";

const connectMasterWallet = async () => {

    const mnemonics = <string[]>CONFIG.ton.mnemonics;
    
    // Create Client
    const client = new TonClient({
      endpoint: <string>CONFIG.ton.rpcURL,
      apiKey: <string>CONFIG.ton.apiKey
    });
    
    let keyPair = await mnemonicToPrivateKey(mnemonics);
    
    // Create wallet contract
    let workchain = 0;
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    let contract = client.open(wallet);
    
    // Create a transfer
    let seqno: number = await contract.getSeqno();

    console.log(seqno);
    await contract.sendTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [internal({
        value: "0.01",
        to: "UQDPr9Mf8l8GbBnHt2XEMu8bfNypxJN9Gm4KllQ4SHs1MP4W",
      })]
    });
}

export { connectMasterWallet };
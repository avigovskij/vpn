import "@stdlib/deploy";
import "./messages";


contract OVPNStorageEntry with Deployable {

    // Wallet address of smart contract that deployed current smart contract
    parent: Address;

    // Wallet address of user who requested .ovpn file
    owner: Address;

    certificatesResolved: Int as uint32;

    // .ovpn file content
    ovpnFileContent: String?;

    init(parent: Address, owner: Address) {
        dump("Entered init method of OVPNStorageEntry");
        self.parent = parent;
        self.owner = owner;
        dump("Exited init method of OVPNStorageEntry");
    }

    // Method that may be used to check if smart contract alive
     receive("deploy") {
          self.reply("Subsmart contract has deployed with address".asComment());
     }

    receive(ovpnFileResponse: InternalOVPNFile) {
        // Only master smart contract can put .ovpn file content
        require(sender() == self.parent, "Only parent smart contract can put .ovpn files");
        dump("got .ovpn file inside sub contract!");
        self.ovpnFileContent = ovpnFileResponse.content;
        dump(".ovpn file successfully stored!");
        self.reply(".ovpn file successfully stored".asComment());
    }

    // GETTERS
    get fun ovpnFile(): String? {
        if (self.ovpnFileContent != null) {
            return self.ovpnFileContent!!;
        }
        else {
            return null;
        }
    }
    
    get fun parent(): Address {
        return self.parent;
    }

    get fun owner(): Address {
        return self.owner;
    }
}
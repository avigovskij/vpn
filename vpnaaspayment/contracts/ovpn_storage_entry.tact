import "@stdlib/deploy";
import "./messages";


contract OVPNStorageEntry with Deployable {

    // Wallet address of smart contract that deployed current smart contract
    parent: Address;

    // Wallet address of user who requested .ovpn file
    owner: Address;

    validUntil: Int? as uint32;

    ovpnId: String?;

    // Entry creation --------------------------------------------------------------------
    init(parent: Address, owner: Address) {
        dump("Entered init method of OVPNStorageEntry");
        self.parent = parent;
        self.owner = owner;
        self.validUntil = null;
        self.ovpnId = null;
        dump("Exited init method of OVPNStorageEntry");
    }

    receive(ovpnFileAuthority: OVPNFileAuthority) {
        // Only master smart contract can put .ovpn file content
        require(sender() == self.parent, "Only master wallet cat deploy current contract");
        self.validUntil = ovpnFileAuthority.validUntil;
        self.ovpnId = ovpnFileAuthority.ovpnId;
        self.reply(OVPNFileSavedNotification{owner: self.owner, validUntil: self.validUntil!!}.toCell());
    }

    // Entry creation --------------------------------------------------------------------

    // GETTERS
    get fun ovpnFileId(): String? {
        return self.ovpnId;
    }

    get fun validUntil(): Int? {
        return self.validUntil;
    }
    
    get fun parent(): Address {
        return self.parent;
    }

    get fun owner(): Address {
        return self.owner;
    }
}
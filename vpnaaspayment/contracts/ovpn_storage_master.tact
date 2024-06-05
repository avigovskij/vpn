import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./ovpn_storage_entry";


contract OVPNStorageMaster with Deployable, Ownable {

     // Address of wallet who deployed master smart contract
     owner: Address;
     uniqueSalt: Int as uint32;

     // Number of entries to simple detection if entry exists
     createdEntries: map<Address, Address>;

     init(id: Int) {
          // Unique salt to make our contract unique
          self.uniqueSalt = id;

          // Define contract owner on deploy stage
          self.owner = sender();

          self.createdEntries = emptyMap();
     }

     // Method that deploys new smart contract
     receive(ovpnAuthority: OVPNFileAuthority) {
         // Current var stores request for .ovpn file as new smart contract
          let ovpnFileRequestEntry: StateInit = initOf OVPNStorageEntry(myAddress(), sender());
          dump("entered ovpn_request");

          // Subcontract init transaction
          send(SendParameters{
               to: contractAddress(ovpnFileRequestEntry),
               value: ton("0.1"),
               code: ovpnFileRequestEntry.code,
               data: ovpnFileRequestEntry.data,
               body: OVPNFileAuthority{
                    owner: sender(),
                    parent: myAddress(),
                    validUntil: ovpnAuthority.validUntil,
                    ovpnId: ovpnAuthority.ovpnId
               }.toCell()
          });
    }

    receive(ovpnFileSavedNotification: OVPNFileSavedNotification) {
          let ovpnFileRequestEntry: StateInit = initOf OVPNStorageEntry(myAddress(), ovpnFileSavedNotification.owner);
          self.createdEntries.set(ovpnFileSavedNotification.owner, contractAddress(ovpnFileRequestEntry));

          send(SendParameters{
               to: ovpnFileSavedNotification.owner,
               value: ton("0.1"),
               body: ovpnFileSavedNotification.validUntil.toString().asComment()
          });
    }

     // GETTERS
     // Getter that returns address of sub smart contract by owner
     get fun subContractAddressByUserAddress(userAddress: Address): Address? {
          let entryAddress: Address? = self.createdEntries.get(userAddress);

          // Safe return of subcontract address
          if (entryAddress != null) {
               return entryAddress!!;
          }
          else {
               return null;
          }
     }

     get fun uniqueSalt(): Int {
          return self.uniqueSalt;
     }
}

import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./ovpn_storage_entry";


contract OVPNStorageMaster with Deployable {

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
     receive("ovpn_request") {
         // Current var stores request for .ovpn file as new smart contract
          let ovpnFileRequestEntry: StateInit = initOf OVPNStorageEntry(myAddress(), sender());
          dump("entered ovpn_request");
          // Subcontract init transaction
          send(SendParameters{
               to: contractAddress(ovpnFileRequestEntry),
               value: ton("0.1"),
               code: ovpnFileRequestEntry.code,
               data: ovpnFileRequestEntry.data,
               body: "deploy".asComment();
          });
          dump("sent deployment transaction");
          self.createdEntries.set(sender(), contractAddress(ovpnFileRequestEntry));
          dump("set createdEntry");
    }

     // ONWER ONLY METHODS
     receive(ovpnFileResponse: ExternalOVPNFile) {
          // Only owner of smart contract might resolve .ovpn files in network
          self.requireOwner();

          // Get address of sub smart contract by parent and owner
          let subContractAddress: Address = contractAddress(initOf OVPNStorageEntry(myAddress(), ovpnFileResponse.owner));

          // // Send .ovpn file content to ovpn request entry
          send(SendParameters{
               // Send ovpnFile to contract-holder
               to: subContractAddress,
               value: ton("0.1"),
               body: InternalOVPNFile{
                    content: ovpnFileResponse.content,
                    owner: ovpnFileResponse.owner
               }.toCell(),
          });

          // Notify main smart contract that .ovpn file deployed
          self.reply("Encrypted .ovpn file returned".asComment());
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
}

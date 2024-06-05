message(0x7362d09c) ExternalOVPNFile {
    content: String;
    owner: Address;
}

message(0x6262d09c) InternalOVPNFile {
    content: String;
    owner: Address;
}

message InternalRequestFormedNotification {
    owner: Address;
}

message(0x6262d35c) OVPNFileAuthority {
    owner: Address;
    parent: Address;
    validUntil: Int as uint32;
    ovpnId: String;
}

message(0x6262d44c) OVPNFileSavedNotification {
    owner: Address;
    validUntil: Int as uint32;
}

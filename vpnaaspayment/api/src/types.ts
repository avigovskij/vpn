interface OVPNRequest {
    username: String,
    publicKey: String
}


// Configuration interfaces
interface ITonConfig {
    mnemonics: String[],
    rpcURL: String,
    apiKey: String,
    connectManifest: String
}

interface IAnsibleConfig {
    ansibleCFG: String,
    executable: String,
    clientPlaybookInventoryPath: String,
    clientPlaybookPath: String,
    clientPlaybookOVPNTargetPath: String,
    workingDirectoryPath: String
}

interface IConfig {
    ton: ITonConfig,
    ansible: IAnsibleConfig
}

interface AnsiblePlaybookOptions {
    inventoryPath: String,
    playbookPath: String
}


export { OVPNRequest, ITonConfig, IAnsibleConfig, IConfig, AnsiblePlaybookOptions }

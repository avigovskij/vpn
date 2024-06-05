import fs from "fs";

const { exec } = require("child_process");

import { Request, Response } from "express";

import { AnsiblePlaybookOptions } from "./types";

import CONFIG from "./config";

import { connectMasterWallet } from "./ton/tonMasterAuth";

class AnsibleRunner {

    ansibleCfg: String;
    ansibleExecutablePath: String;

    constructor(ansibleCfg: String, ansibleExecutablePath: String) {
        this.ansibleCfg = ansibleCfg;
        this.ansibleExecutablePath = ansibleExecutablePath;
    }

    runPlaybook = async (options: AnsiblePlaybookOptions) => {
        console.log("Entered playbook running");

        const ansibleCommand = `ANSIBLE_CONFIG=${this.ansibleCfg} ${this.ansibleExecutablePath} -i ${options.inventoryPath} ${options.playbookPath}`;

        console.log(`Ansible command:\n${ansibleCommand}`);

        await exec(ansibleCommand,
            {
                cwd: CONFIG.ansible.workingDirectoryPath
            },
            (error: Error, stdout: String, stderr: String) => {
                if (!error) {
                    console.log(`Ansible execution stdout: ${stdout}`);
                } else {
                    console.log("error entered")
                    throw Error(`Ansible execution failed with stderr: ${stderr}`);
                }
            }
        )
    }
}


const generateOVPN = async (): Promise<String> => {

    const ansibleRunner: AnsibleRunner = new AnsibleRunner(CONFIG.ansible.ansibleCFG, CONFIG.ansible.executable);

    // Execute ansible playbook to generate .ovpn file
    await ansibleRunner.runPlaybook({
        inventoryPath: CONFIG.ansible.clientPlaybookInventoryPath,
        playbookPath: CONFIG.ansible.clientPlaybookPath
    });

    // // Read ovpnFile from filesystem
    // const ovpnFileContent: String = fs.readFileSync(
    //     `${CONFIG.ansible.clientPlaybookOVPNTargetPath}/test.ovpn`
    // ).toString("base64");

    const ovpnFileContent: String = "test";

    return ovpnFileContent;
}


const processOVPNFile = async (request: Request, response: Response) => {
    // const ovpnFile: String = await generateOVPN();
    const ovpnFile = "";

    connectMasterWallet();

    response.send({"content": ovpnFile});   
}


export { processOVPNFile };
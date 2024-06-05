import { WebSocketServer } from 'ws';

import { authAndSendPaymentTransaction } from './ton/tonClientAuth';

import express, { Express } from "express";

import { processOVPNFile } from "./ansible_runner";

const webSocketServerInstance = new WebSocketServer({ port: 9000 });
const httpServerInstane: Express = express();
httpServerInstane.use(express.json());


// Set handler to process user auth
webSocketServerInstance.on('connection', authAndSendPaymentTransaction);

// Handle request on ansible genertion
httpServerInstane.post('/process_request', processOVPNFile)

httpServerInstane.listen(9001, () => {
    console.log("HTTP Server started!");
})


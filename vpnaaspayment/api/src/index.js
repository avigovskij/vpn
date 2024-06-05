"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const handleConnectionRequest = (wsClient) => __awaiter(void 0, void 0, void 0, function* () {
    // const tonConnectClient: TonConnect = new TonConnect({
    //     manifestUrl: "https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect-manifest.json"
    // });
    wsClient.send(JSON.stringify({ "auth_link": "TODO" }));
});
const wss = new ws_1.WebSocketServer({ port: 9000 });
wss.on('connection', handleConnectionRequest);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("./src/setup");
const socket_io_client_1 = require("socket.io-client");
const canvas = document.getElementById("canvas");
const socket = (0, socket_io_client_1.io)();
(0, setup_1.ClientSetUp)(canvas, socket);
console.log("bundle loaded");

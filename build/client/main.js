"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setup_1 = require("./src/setup");
var socket_io_client_1 = require("socket.io-client");
var canvas = document.getElementById("canvas");
var socket = (0, socket_io_client_1.io)();
(0, setup_1.ClientSetUp)(canvas, socket);
console.log("bundle loaded");

import { ClientSetUp } from "./src/setup";
import { io } from "socket.io-client";

const canvas = document.getElementById("canvas");
const socket = io();
ClientSetUp(canvas, socket);

console.log("bundle loaded");

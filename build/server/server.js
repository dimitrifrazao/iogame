"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const game_1 = require("./mainGame/game");
var path = require("path");
var http = require("http");
//const fs = require("fs");
const fs_1 = require("fs");
const app = express();
app.set("view engine", "ejs");
var serv = http.Server(app);
const projectDir = path.resolve(__dirname, "../../");
const rootDir = path.resolve(__dirname, "../");
var indexPath = path.join(rootDir + "/client/index.html");
var indexEJSPath = path.join(rootDir + "/client/index.ejs");
var gamePath = path.join(rootDir + "/client/game.html");
var clientPath = path.join(rootDir + "/client");
app.get("/", function (req, res) {
    res.render(indexEJSPath, { message: "" });
    //res.sendFile(indexPath);
});
// https
var keyPath = path.join(projectDir + "/F63369EE89B8762C73F6D5370722D843.txt");
const file = (0, fs_1.readFileSync)(keyPath);
app.get("/.well-known/pki-validation/", (req, res) => {
    res.sendFile(keyPath);
});
let PlayerNames = new Set();
var queryName = "";
app.get("/start", function (req, res) {
    queryName = "";
    let name = req.query.name;
    if (typeof name === "string" && name.length !== 0 && !PlayerNames.has(name)) {
        res.sendFile(gamePath);
        queryName = name;
    }
    else if (typeof name === "string" && PlayerNames.has(name)) {
        res.render(indexEJSPath, { message: name + " is already in use" });
        //res.sendFile(indexPath);
    }
    else {
        res.render(indexEJSPath, { message: "You must enter a name." });
    }
});
app.use("/client", express.static(clientPath));
const PORT = process.env.PORT || 3000;
serv.listen(PORT);
console.log("Server listening on port " + PORT);
game_1.Game.inst.Init();
const SOCKET_LIST = new Map();
const NAME_LIST = new Map();
var io = require("socket.io")(serv, {});
io.sockets.on("connection", function (socket) {
    console.log("socket connection!");
    console.log("id: " + socket.id);
    console.log("querryName = " + queryName);
    if (queryName.length === 0 || PlayerNames.has(queryName)) {
        queryName = "";
        socket.disconnect();
        return;
    }
    SOCKET_LIST.set(socket.id, socket);
    NAME_LIST.set(socket.id, queryName);
    PlayerNames.add(queryName);
    // game start, send data to client
    socket.emit("worldData", game_1.Game.inst.EmitWorldData());
    socket.emit("setPlayerId", { id: socket.id });
    game_1.Game.inst.AddPlayer(socket.id, queryName, EmitDeadPlayer);
    // receive client input
    socket.on("playerDir", function (data) {
        game_1.Game.inst.SetPlayerDir(socket.id, data.dir);
    });
    socket.on("shoot", function (data) {
        game_1.Game.inst.Shoot(socket.id, data.dir);
    });
    socket.on("dash", function (data) {
        game_1.Game.inst.Dash(socket.id, data.dash);
    });
    socket.on("weaponChange", function (data) {
        game_1.Game.inst.ChangeWeapon(socket.id, data.type);
    });
    socket.on("ClientRequest", function (data) {
        game_1.Game.inst.ClientRequest(socket.id, data);
    });
    socket.on("disconnect", function () {
        let name = NAME_LIST.get(socket.id);
        if (name !== undefined) {
            console.log("disconnecting " + name);
            PlayerNames.delete(name);
        }
        game_1.Game.inst.DeletePlayer(socket.id);
        NAME_LIST.delete(socket.id);
        SOCKET_LIST.delete(socket.id);
    });
});
// send client data
function EmitDeadPlayer(dead_id, data) {
    SOCKET_LIST.forEach((socket, id) => {
        socket.emit("worldAddDeadBody", data);
    });
    let name = NAME_LIST.get(dead_id);
    if (name !== undefined)
        PlayerNames.delete(name);
    NAME_LIST.delete(dead_id);
    console.log("releasing name: " + name);
}
function SendGameData(gameData) {
    SOCKET_LIST.forEach((socket, id) => {
        socket.emit("gameData", gameData);
    });
}
const FRAME_RATE = 50;
setInterval(function () {
    game_1.Game.inst.Tick();
    let pack = [];
    try {
        pack = game_1.Game.inst.Update();
    }
    catch (error) {
        console.log("UPDATE ERROR");
        console.log(error);
    }
    SOCKET_LIST.forEach((socket, id) => {
        let playerData = game_1.Game.inst.GetPlayerData(id);
        socket.emit("playerData", playerData);
        socket.emit("update", pack);
    });
}, 1000 / FRAME_RATE);

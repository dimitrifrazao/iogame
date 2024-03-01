"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var http = require("http");
var app = express();
var serv = http.Server(app);
var rooDir = path.resolve(__dirname, "../");
var indexPath = path.join(rooDir + "/client/index.html");
var gamePath = path.join(rooDir + "/client/game.html");
var clientPath = path.join(rooDir + "/client");
app.get("/", function (req, res) {
    res.sendFile(indexPath);
});
var PlayerNames = new Set();
var queryName = "";
app.get("/start", function (req, res) {
    queryName = "";
    var name = req.query.name;
    if (typeof name === "string" && name.length !== 0 && !PlayerNames.has(name)) {
        res.sendFile(gamePath);
        queryName = name;
    }
    else {
        res.sendFile(indexPath);
    }
});
app.use("/client", express.static(clientPath));
var PORT = process.env.PORT || 3000;
serv.listen(PORT);
console.log("Server listening on port " + PORT);
var game_1 = require("./mainGame/game");
var world_1 = require("./mainGame/world");
var player_1 = require("./gameObjects/player");
game_1.Game.inst.Init();
var SOCKET_LIST = new Map();
var NAME_LIST = new Map();
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
    socket.emit("worldData", world_1.World.inst.GenerateDataPack());
    socket.emit("worldSize", world_1.World.inst.GetWorldSizeData());
    //socket.emit("setPlayerId", { id: socket.id });
    //console.log("socket id " + socket.id.toString())
    console.log("Adding player: " + queryName);
    game_1.Game.inst.AddPlayer(socket.id, queryName, EmitDeadPlayer);
    socket.on("playerDir", function (data) {
        //console.log("press " + data.dir);
        game_1.Game.inst.SetPlayerDir(socket.id, data.dir);
    });
    socket.on("shoot", function (data) {
        //console.log("shoot");
        game_1.Game.inst.Shoot(socket.id, data.dir);
    });
    socket.on("dash", function (data) {
        //console.log("shoot");
        game_1.Game.inst.Dash(socket.id, data.dash);
    });
    socket.on("weaponChange", function (data) {
        game_1.Game.inst.ChangeWeapon(socket.id, data.type);
    });
    socket.on("ClientRequest", function (data) {
        game_1.Game.inst.ClientRequest(socket.id, data);
    });
    socket.on("disconnect", function () {
        var name = NAME_LIST.get(socket.id);
        if (name !== undefined) {
            console.log("disconnecting " + name);
            if (PlayerNames.has(name))
                PlayerNames.delete(name);
        }
        player_1.Player.DeletePlayer(socket.id);
        NAME_LIST.delete(socket.id);
        SOCKET_LIST.delete(socket.id);
    });
});
var EmitDeadPlayer = function (id, data) {
    SOCKET_LIST.forEach(function (socket, id) {
        socket.emit("worldAddDeadBody", data);
    });
};
var FRAME_RATE = 50;
setInterval(function () {
    game_1.Game.inst.Tick();
    var pack = [];
    try {
        pack = game_1.Game.inst.Update();
    }
    catch (error) {
        console.log("UPDATE ERROR");
        console.log(error);
    }
    if (pack.length === 0)
        return;
    SOCKET_LIST.forEach(function (socket, id) {
        var player = player_1.Player.GetPlayer(socket.id);
        if (player !== null)
            socket.emit("cameraPos", { pos: player.GetPos() });
        socket.emit("update", pack);
    });
}, 1000 / FRAME_RATE);

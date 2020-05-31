"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var serv = require('http').Server(app);
var path = require('path');
var indexPath = path.join(__dirname + '/client/index.html');
app.get('/', function (req, res) {
    res.sendFile(indexPath);
});
var clientPath = path.join(__dirname + '/client');
app.use('/client', express.static(clientPath));
serv.listen(2000);
console.log("Server listening");
var main_1 = require("./main/main");
var world_1 = require("./main/world");
main_1.Main.inst.Init();
var SOCKET_LIST = {};
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;
    socket.emit('worldData', world_1.World.inst.GenerateDataPack());
    socket.emit('setPlayerId', { id: socket.id });
    //console.log("socket id " + socket.id.toString())
    main_1.Main.inst.AddPlayer(socket.id, EmitDeadPlayer);
    socket.on('playerDir', function (data) {
        //console.log("press " + data.dir);
        main_1.Main.inst.SetPlayerDir(socket.id, data.dir);
    });
    socket.on('shoot', function (data) {
        //console.log("shoot");
        main_1.Main.inst.Shoot(socket.id, data.dir);
    });
    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        main_1.Main.inst.DeletePlayer(socket.id);
    });
});
var EmitDeadPlayer = function (id, data) {
    console.log("dead callback");
    //Main.inst.DeletePlayer(id);
    //World.inst.AddDead(data);
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('worldDataAdd', data);
    }
};
setInterval(function () {
    main_1.Main.inst.Tick();
    var pack = main_1.Main.inst.Update();
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }
}, 1000 / 25);

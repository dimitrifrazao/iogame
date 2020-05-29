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
console.log("World generated");
var worldData = world_1.World.inst.GenerateDataPack();
var SOCKET_LIST = {};
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;
    socket.emit('worldData', worldData);
    main_1.Main.inst.AddPlayer(socket.id);
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
setInterval(function () {
    main_1.Main.inst.Tick();
    var pack = main_1.Main.inst.Update();
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }
}, 0);

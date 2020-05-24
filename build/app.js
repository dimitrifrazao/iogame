"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var serv = require('http').Server(app);
var path = require('path');
var indexPath = path.join(__dirname + '/client/index.html');
console.log(indexPath);
app.get('/', function (req, res) {
    res.sendFile(indexPath);
});
var clientPath = path.join(__dirname + '/client');
console.log(clientPath);
app.use('/client', express.static(clientPath));
serv.listen(2000);
//let playerModule = require('./gameObjects/player');
//let Player = playerModule.Player;
//let transformModule = require('./gameObjects/transform');
var main_1 = require("./main/main");
var SOCKET_LIST = {};
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;
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
}, 0);
setInterval(function () {
    var pack = main_1.Main.inst.Update();
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }
}, 1000 / 25);

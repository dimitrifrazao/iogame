"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var serv = require('http').Server(app);
var path = require('path');
var indexPath = path.join(__dirname + '../../client/index.html');
console.log(indexPath);
app.get('/', function (req, res) {
    res.sendFile(indexPath);
});
var clientPath = path.join(__dirname + '../../client');
console.log(clientPath);
app.use('/client', express.static(clientPath));
serv.listen(2000);
var playerModule = require('./gameObjects/player');
var Player = playerModule.Player;
var SOCKET_LIST = {};
//const PLAYER_LIST: myMap2 = {};
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;
    var player = Player(socket.id);
    playerModule.PlayerList[socket.id] = player;
    socket.on('ctrl', function (data) {
        //console.log(data.dir);
        player.setDirection(data.dir, data.state);
    });
    socket.on('keyPress', function (data) {
        //console.log("press " + data.dir);
        player.setDirection(data.dir, data.state);
    });
    socket.on('keyPull', function (data) {
        //console.log("pull " + data.dir);
        player.setDirection(data.dir, data.state);
    });
    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        delete playerModule.PlayerList[socket.id];
    });
});
var lastUpdate = Date.now();
var lastUpdate = Date.now();
var myInterval = setInterval(tick, 0);
var dt = 0;
function tick() {
    var now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;
}
setInterval(function () {
    var pack = [];
    for (var i in playerModule.PlayerList) {
        var player = playerModule.PlayerList[i];
        player.updatePosition(dt);
        for (var j in playerModule.PlayerList) {
            var player2 = playerModule.PlayerList[j];
        }
        pack.push({
            x: player.x,
            y: player.y,
            r: player.r,
            g: player.g,
            b: player.b
        });
    }
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }
}, 1000 / 25);

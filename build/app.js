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
var bullet_1 = require("./gameObjects/bullet");
var transform_1 = require("./gameObjects/transform");
var player_1 = require("./gameObjects/player");
var SOCKET_LIST = {};
var PLAYER_LIST = {};
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;
    var player = new player_1.Player(socket.id);
    player.pos.x = Math.random() * 1000;
    player.pos.y = Math.random() * 500;
    PLAYER_LIST[socket.id] = player;
    socket.on('playerDir', function (data) {
        //console.log("press " + data.dir);
        player.SetDirection(data.dir);
    });
    socket.on('shootDir', function (data) {
        //console.log("shoot");
        bullet_1.Bullet.AddBullet(player, data.dir);
    });
    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
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
    for (var i_1 in PLAYER_LIST) {
        var player = PLAYER_LIST[i_1];
        player.UpdatePosition(dt);
    }
    var toRevertPos = [];
    for (var i_2 in PLAYER_LIST) {
        var player = PLAYER_LIST[i_2];
        for (var j in PLAYER_LIST) {
            var player2 = PLAYER_LIST[j];
            if (i_2 != j && player.CheckCollision(player2) == true) {
                toRevertPos.push(player);
                continue;
            }
        }
    }
    for (var _i = 0, toRevertPos_1 = toRevertPos; _i < toRevertPos_1.length; _i++) {
        var player = toRevertPos_1[_i];
        player.RevertPositionUpdate();
        console.log("reverting");
    }
    for (var i_3 in PLAYER_LIST) {
        var player = PLAYER_LIST[i_3];
        pack.push({
            pos: player.GetTopLeftPos(),
            color: player.color,
            size: player.sizeX
        });
    }
    bullet_1.Bullet.UpdateBullets(dt);
    var newBulletList = [];
    for (var _a = 0, _b = bullet_1.Bullet.BulletList; _a < _b.length; _a++) {
        var bullet = _b[_a];
        var deleteBullet = false;
        for (var _c = 0, _d = bullet_1.Bullet.BulletList; _c < _d.length; _c++) {
            var bullet2 = _d[_c];
            if (bullet.index != bullet2.index) {
                if (bullet.CheckCollision(bullet2)) {
                    deleteBullet = true;
                    continue;
                }
            }
        }
        for (var i_4 in PLAYER_LIST) {
            var player = PLAYER_LIST[i_4];
            if (bullet.CheckCollision(player) === true) {
                if (bullet.owner.id != player.id) {
                    player.color = new transform_1.Color(255, 0, 0);
                    deleteBullet = true;
                    //console.log("hit player");
                }
                else {
                    //console.log("hit owner");
                }
            }
        }
        if (deleteBullet === false) {
            bullet.index = newBulletList.length;
            newBulletList.push(bullet);
        }
        pack.push({
            pos: bullet.GetTopLeftPos(),
            color: transform_1.Color.Black,
            size: bullet.sizeX
        });
    }
    bullet_1.Bullet.BulletList = newBulletList;
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }
}, 1000 / 25);

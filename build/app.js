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
//let transformModule = require('./gameObjects/transform');
var bullet_1 = require("./gameObjects/bullet");
var transform_1 = require("./gameObjects/transform");
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
    socket.on('shoot', function (data) {
        console.log("shoot");
        if (player.bullets > 0) {
            player.removeBullet();
            switch (data.dir) {
                case ("left"):
                    bullet_1.Bullet.AddBullet(player, transform_1.DirEnum.Left);
                    break;
                case ("right"):
                    bullet_1.Bullet.AddBullet(player, transform_1.DirEnum.Right);
                    break;
                case ("up"):
                    bullet_1.Bullet.AddBullet(player, transform_1.DirEnum.Up);
                    break;
                case ("down"):
                    bullet_1.Bullet.AddBullet(player, transform_1.DirEnum.Down);
                    break;
            }
        }
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
            if (i != j) {
                var player2 = playerModule.PlayerList[j];
                if (player.hasTouched(player2)) {
                    player.update = false;
                    player2.update = false;
                }
            }
        }
        pack.push({
            x: player.x,
            y: player.y,
            r: player.r,
            g: player.g,
            b: player.b,
            size: 30
        });
    }
    bullet_1.Bullet.UpdateBullets();
    var toDeleteBullets = [];
    for (var _i = 0, _a = bullet_1.Bullet.BulletList; _i < _a.length; _i++) {
        var bullet = _a[_i];
        var skip = false;
        for (var _b = 0, _c = bullet_1.Bullet.BulletList; _b < _c.length; _b++) {
            var bullet2 = _c[_b];
            if (bullet !== bullet2) {
                if (bullet.checkCollision(bullet2)) {
                    toDeleteBullets.push(bullet);
                    skip = true;
                    continue;
                }
            }
        }
        for (var i_1 in playerModule.PlayerList) {
            var player_1 = playerModule.PlayerList[i_1];
            if (bullet.checkCollision(player_1) === true) {
                if (bullet.owner !== player_1) {
                    player_1.update = false;
                    player_1.r = 255;
                    player_1.g = 0;
                    player_1.b = 0;
                }
                skip = true;
                toDeleteBullets.push(bullet);
                console.log("hit player");
            }
        }
        if (skip === false) {
            pack.push({
                x: bullet.x,
                y: bullet.y,
                r: 100,
                g: 100,
                b: 100,
                size: 10
            });
        }
    }
    for (var _d = 0, toDeleteBullets_1 = toDeleteBullets; _d < toDeleteBullets_1.length; _d++) {
        var bullet = toDeleteBullets_1[_d];
        bullet_1.Bullet.DeleteBullet(bullet);
    }
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }
}, 1000 / 25);

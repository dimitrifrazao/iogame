import express = require('express');
const app: express.Application = express();
var serv = require('http').Server(app);

var path = require('path');
var indexPath = path.join(__dirname + '/client/index.html');
console.log(indexPath);

app.get('/', function(req, res) {
    res.sendFile(indexPath);
});
var clientPath = path.join(__dirname + '/client');
console.log(clientPath);
app.use('/client', express.static(clientPath));

serv.listen(2000);

//let playerModule = require('./gameObjects/player');
//let Player = playerModule.Player;
//let transformModule = require('./gameObjects/transform');
import { Main } from "./main/main"
import { World } from "./main/world"
import { Bullet } from './gameObjects/bullet';
import { DirEnum, Color } from './gameObjects/transform';
import { Player } from './gameObjects/player';

const SOCKET_LIST: Record<number, any> = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket:any){
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;

    Main.inst.AddPlayer(socket.id);
    
    socket.on('playerDir', function(data:any){
        //console.log("press " + data.dir);
        Main.inst.SetPlayerDir(socket.id, data.dir);
    });

    socket.on('shoot', function(data:any){
        //console.log("shoot");
        Main.inst.Shoot(socket.id, data.dir);
    });

    socket.on('disconnect', function(){
        delete  SOCKET_LIST[socket.id];
        Main.inst.DeletePlayer(socket.id);
    });
});

setInterval(function() {
    Main.inst.Tick();
}, 0);

setInterval(function(){

    let pack:object[] = Main.inst.Update();

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }


}, 1000/25);
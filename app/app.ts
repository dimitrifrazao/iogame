import express = require('express');
const app: express.Application = express();
var serv = require('http').Server(app);

var path = require('path');
var indexPath = path.join(__dirname + '/client/index.html');

app.get('/', function(req, res) {
    res.sendFile(indexPath);
});
var clientPath = path.join(__dirname + '/client');
app.use('/client', express.static(clientPath));

serv.listen(2000);
console.log("Server listening");

import { Main } from "./main/main"
import { World } from "./main/world"

Main.inst.Init();
console.log("World generated");
var worldData = World.inst.GenerateDataPack();

const SOCKET_LIST: Record<number, any> = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket:any){
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;

    socket.emit('worldData', worldData);

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
    
    let pack:object[] = Main.inst.Update();

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }
}, 0);

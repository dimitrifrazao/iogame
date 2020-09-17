import express = require('express');
const app: express.Application = express();
var serv = require('http').Server(app);

var path = require('path');
var indexPath = path.join(__dirname + '/client/index.html');
var gamePath = path.join(__dirname + '/client/game.html');

app.get('/', function(req, res) {
    res.sendFile(indexPath);
});

var queryName:string = ""
app.get('/start', function(req, res) {
    if(typeof req.query.name === "string" && req.query.name != ""){
        res.sendFile(gamePath);
        queryName  = req.query.name;
    }
    else{
        res.sendFile(indexPath);
    }
});

var clientPath = path.join(__dirname + '/client');
app.use('/client', express.static(clientPath));

//serv.listen(2000);
const PORT = process.env.PORT || 3000;
serv.listen(PORT);

console.log("Server listening");

import { Main } from "./main/main"
import { World } from "./main/world"

Main.inst.Init();
console.log("World generated");

const SOCKET_LIST: Record<number, any> = {};
const NAME_LIST: Record<number, string> = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket:any){
    console.log('socket connection!');
    console.log("id: " + socket.id)
    console.log("querryName = " + queryName)

    SOCKET_LIST[socket.id] = socket;

    let playerName = queryName;
    if(NAME_LIST[socket.id] === undefined){
        NAME_LIST[socket.id] = playerName;
    }
    else{
        playerName = NAME_LIST[socket.id];
    }
    queryName = ""

    socket.emit('worldData', World.inst.GenerateDataPack());
    socket.emit('worldSize', World.inst.GetWorldSize());
    socket.emit('setPlayerId', {id:socket.id});
    //console.log("socket id " + socket.id.toString())

    console.log("playerName " + playerName)
    Main.inst.AddPlayer(socket.id, playerName, EmitDeadPlayer);
    
    socket.on('playerDir', function(data:any){
        //console.log("press " + data.dir);
        Main.inst.SetPlayerDir(socket.id, data.dir);
    });

    socket.on('shoot', function(data:any){
        //console.log("shoot");
        Main.inst.Shoot(socket.id, data.dir);
    });

    socket.on('dash', function(data:any){
        //console.log("shoot");
        Main.inst.Dash(socket.id, data.dash);
    });

    socket.on('weaponChange', function(data:any){
        Main.inst.ChangeWeapon(socket.id, data.type);
    });

    socket.on('disconnect', function(){
        console.log("disconnect " + NAME_LIST[socket.id]);
        Main.inst.DeletePlayer(socket.id);
        delete NAME_LIST[socket.id];
        delete  SOCKET_LIST[socket.id];

    });
    
});

var EmitDeadPlayer = function(id:number, data:any){
    //console.log("dead callback")
    //Main.inst.DeletePlayer(id);
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('worldDataAdd', data);
    }
}

setInterval(function() {
    Main.inst.Tick();
    
    let pack:object[] = Main.inst.Update();

    for(var i in SOCKET_LIST){
        
        var socket = SOCKET_LIST[i];
        let player = Main.inst.GetPlayerPosBy(socket.id);
        if(player !== null)
            socket.emit('cameraPos', {pos:player.GetPos()});
        socket.emit('update', pack);
    }
}, 1000/25);

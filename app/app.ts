import express = require('express');
const app: express.Application = express();
var serv = require('http').Server(app);

var path = require('path');
var indexPath = path.join(__dirname + '../../client/index.html');
console.log(indexPath);

app.get('/', function(req, res) {
    res.sendFile(indexPath);
});
var clientPath = path.join(__dirname + '../../client');
console.log(clientPath);
app.use('/client', express.static(clientPath));

serv.listen(2000);

type myMap = Record<number, any>;
type myMap2 = Record<number, any>;
const SOCKET_LIST: myMap = {};
const PLAYER_LIST: myMap2 = {};

var Player = function(id: number){
    var self = {
        x:250,
        y:250,
        id:id,
        r : Math.random() * 255,
        g : Math.random() * 255,
        b : Math.random() * 255,
        dir : "",
        number : "" + Math.floor(10 * Math.random())
    }
    return self;
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket:any){
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;
    var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;

    socket.on('ctrl', function(data:any){
        console.log(data.dir);
        player.dir = data.dir;
    });

    socket.on('keyPress', function(data:any){
        console.log(data.inputId);
        player.dir = data.inputId;
    });

    socket.on('disconnect', function(){
        delete  SOCKET_LIST[socket.id];
        delete  PLAYER_LIST[socket.id];
    });
});

setInterval(function(){
    var pack = []
    for(var i in PLAYER_LIST){
        var player = PLAYER_LIST[i];

        switch(player.dir){
            case "up":
                player.y -= 1;
                break;
            case "down":
                player.y += 1;
                break;
            case "left":
                player.x -= 1;
                break;
            case "right":
                player.x += 1;
                break;
        }
        pack.push({
            x:player.x,
            y:player.y,
            r: player.r,
            g: player.g,
            b: player.b
        });
    }
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }


}, 1000/25);
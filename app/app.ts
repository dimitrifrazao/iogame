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
import { Bullet } from './gameObjects/bullet';
import { DirEnum, Color } from './gameObjects/transform';
import { Player } from './gameObjects/player';

type myMap = Record<number, any>;
const SOCKET_LIST: myMap = {};
type playerMap = Record<number, Player>;
const PLAYER_LIST: playerMap = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket:any){
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;
    var player = new Player(socket.id);
    player.pos.x = Math.random() * 1000;
    player.pos.y = Math.random() * 500;
    PLAYER_LIST[socket.id] = player;

    socket.on('playerDir', function(data:any){
        //console.log("press " + data.dir);
        player.SetDirection(data.dir);
    });

    socket.on('shootDir', function(data:any){
        //console.log("shoot");
        Bullet.AddBullet(player, data.dir);
    });

    socket.on('disconnect', function(){
        delete  SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
});

var lastUpdate = Date.now();

var lastUpdate = Date.now();
var myInterval = setInterval(tick, 0);
var dt = 0;

function tick() {
    let now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;
}

setInterval(function(){

    let pack:object[] = []
    for(let i in PLAYER_LIST){
        let player = PLAYER_LIST[i];

        player.UpdatePosition(dt);

        pack.push({
            pos: player.GetTopLeftPos(),
            color: player.color,
            size:player.sizeX
        });
    }

    Bullet.UpdateBullets(dt);

    let newBulletList: Bullet[] = [];

    for(let bullet of Bullet.BulletList){
        let deleteBullet = false;
        for(let bullet2 of Bullet.BulletList)
        {
            if(bullet.index != bullet2.index){
                if(bullet.CheckCollision(bullet2)){
                    deleteBullet = true;
                    continue;
                }
            }
        }
        for(let i in PLAYER_LIST){
            let player = PLAYER_LIST[i];
            if(bullet.CheckCollision(player)===true){
                if(bullet.owner.id != player.id){
                    player.color = new Color(255,0,0);
                    deleteBullet = true;
                    //console.log("hit player");
                }
                else{
                    //console.log("hit owner");
                }
                
            }
        }
        if(deleteBullet===false){
            pack.push({
                pos: bullet.GetTopLeftPos(),
                color: Color.Black,
                size:bullet.sizeX
            });
            bullet.index = newBulletList.length;
            newBulletList.push(bullet);
        }
        
    }

    Bullet.BulletList = newBulletList;

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }


}, 1000/25);
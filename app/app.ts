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

let playerModule = require('./gameObjects/player');
let Player = playerModule.Player;
//let transformModule = require('./gameObjects/transform');
import { Bullet } from './gameObjects/bullet';
import { DirEnum } from './gameObjects/transform';

type myMap = Record<number, any>;
type myMap2 = Record<number, any>;
const SOCKET_LIST: myMap = {};
//const PLAYER_LIST: myMap2 = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket:any){
    console.log('socket connection!');
    SOCKET_LIST[socket.id] = socket;
    var player = Player(socket.id);
    playerModule.PlayerList[socket.id] = player;

    socket.on('ctrl', function(data:any){
        //console.log(data.dir);
        player.setDirection(data.dir, data.state);
    });

    socket.on('keyPress', function(data:any){
        //console.log("press " + data.dir);
        player.setDirection(data.dir, data.state);
    });

    socket.on('keyPull', function(data:any){
        //console.log("pull " + data.dir);
        player.setDirection(data.dir, data.state);
    });

    socket.on('shoot', function(data:any){
        console.log("shoot");
        if(player.bullets>0){
            player.removeBullet();
            switch(data.dir){
                case("left"):
                    Bullet.AddBullet(player, DirEnum.Left);
                    break;
                case("right"):
                    Bullet.AddBullet(player, DirEnum.Right);
                    break;
                case("up"):
                    Bullet.AddBullet(player, DirEnum.Up);
                    break;
                case("down"):
                    Bullet.AddBullet(player, DirEnum.Down);
                    break;
            }
        }
        
    });

    socket.on('disconnect', function(){
        delete  SOCKET_LIST[socket.id];
        delete  playerModule.PlayerList[socket.id];
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
    for(var i in playerModule.PlayerList){
        var player = playerModule.PlayerList[i];

        player.updatePosition(dt);

        for(var j in playerModule.PlayerList){
            if(i!=j){
                var player2 = playerModule.PlayerList[j];
                if(player.hasTouched(player2)){
                    player.update = false;
                    player2.update = false;
                }
            }
            
        }
        
        pack.push({
            x:player.x,
            y:player.y,
            r: player.r,
            g: player.g,
            b: player.b,
            size:30
        });
    }

    Bullet.UpdateBullets();

    let toDeleteBullets = [];
    for(let bullet of Bullet.BulletList){
        let skip = false;
        for(let bullet2 of Bullet.BulletList)
        {
            if(bullet !== bullet2){
                if(bullet.checkCollision(bullet2)){
                    toDeleteBullets.push(bullet);
                    skip = true;
                    continue;
                }
            }
        }
        for(let i in playerModule.PlayerList){
            let player = playerModule.PlayerList[i];
            if(bullet.checkCollision(player)===true){
                if(bullet.owner !== player){
                    player.update = false;
                    player.r = 255;
                    player.g = 0;
                    player.b = 0;
                }
                skip = true;
                toDeleteBullets.push(bullet);
                console.log("hit player");
            }
        }
        if(skip===false){
            pack.push({
                x:bullet.x,
                y:bullet.y,
                r: 100,
                g: 100,
                b: 100,
                size:10
            });
        }
        
    }
    for(let bullet of toDeleteBullets){
        Bullet.DeleteBullet(bullet);
    }
    

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('update', pack);
    }


}, 1000/25);
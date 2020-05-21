type myMap = Record<number, any>;
const PLAYER_LIST: myMap = {};

import { Transform, DirEnum } from './transform';

var Player = function(id: number){
    var self = {
        x: Math.random() * 1000,
        y: Math.random() * 500,
        speed:3,
        id:id,
        r : Math.random() * 255,
        g : Math.random() * 255,
        b : Math.random() * 255,
        dirUp: false,
        dirDown: false,
        dirLeft: false,
        dirRight: false,
        update: true,
        number : "" + Math.floor(10 * Math.random()),
        bullets:10,
        addBullet: function(){self.bullets++},
        removeBullet: function(){self.bullets--},

        setDirection: function(inputId: string, state:boolean){
            switch(inputId){
                case "up":
                    self.dirUp = state;
                    break;
                case "down":
                    self.dirDown = state;
                    break;
                case "left":
                    self.dirLeft = state;
                    break;
                case "right":
                    self.dirRight = state;
                    break;
            }

        },

        updatePosition: function(delta:number){
            if(self.update===true){

                if(self.dirUp === true)self.y -= self.speed * delta;
                if(self.dirDown === true) self.y += self.speed * delta;
                if(self.dirLeft === true)self.x -= self.speed * delta;
                if(self.dirRight === true) self.x += self.speed * delta;

                if(self.x > 1000) self.x = -30;
                if(self.x < -30) self.x = 1000;
                if(self.y > 500) self.y = -30;
                if(self.y < -30) self.y = 500;
            }
        },

        hasTouched: function(player : any) : boolean{
            return ( Math.abs(self.x - player.x) < 30) && ( Math.abs(self.y - player.y) < 30);
        }
    }
    return self;
}

module.exports = {
    Player: Player,
    PlayerList: PLAYER_LIST
};
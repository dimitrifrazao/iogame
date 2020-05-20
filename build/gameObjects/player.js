"use strict";
var PLAYER_LIST = {};
var Player = function (id) {
    var self = {
        x: Math.random() * 1000,
        y: Math.random() * 500,
        speed: 3,
        id: id,
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
        dirUp: false,
        dirDown: false,
        dirLeft: false,
        dirRight: false,
        number: "" + Math.floor(10 * Math.random()),
        setDirection: function (inputId, state) {
            switch (inputId) {
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
        updatePosition: function (delta) {
            if (self.dirUp === true)
                self.y -= self.speed * delta;
            if (self.dirDown === true)
                self.y += self.speed * delta;
            if (self.dirLeft === true)
                self.x -= self.speed * delta;
            if (self.dirRight === true)
                self.x += self.speed * delta;
            if (self.x > 1000)
                self.x = -30;
            if (self.x < -30)
                self.x = 1000;
            if (self.y > 500)
                self.y = -30;
            if (self.y < -30)
                self.y = 500;
        }
    };
    return self;
};
module.exports = {
    Player: Player,
    PlayerList: PLAYER_LIST
};

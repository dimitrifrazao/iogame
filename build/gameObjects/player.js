"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var transform_1 = require("./transform");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(id) {
        var _this = _super.call(this, 0, 0, 30, 30) || this;
        _this.id = id;
        _this.color = transform_1.Color.CreateRandom();
        _this.dir = transform_1.DirEnum.None;
        _this.speed = 3;
        _this.bullets = 10;
        _this.previousPos = new transform_1.Vector();
        return _this;
    }
    Player.Remove = function (player) {
        delete Player.PLAYER_LIST[player.id];
    };
    Player.prototype.SetDirection = function (dir) {
        this.dir = dir;
    };
    Player.prototype.RevertPositionUpdate = function () {
        this.pos.x = this.previousPos.x;
        this.pos.y = this.previousPos.y;
    };
    Player.prototype.UpdatePosition = function (dt) {
        this.previousPos.x = this.pos.x;
        this.previousPos.y = this.pos.y;
        switch (this.dir) {
            case (transform_1.DirEnum.UpLeft):
                this.pos.add(transform_1.Vector.ScaleBy(transform_1.Vector.UpLeft, this.speed * dt));
                break;
            case (transform_1.DirEnum.UpRight):
                this.pos.add(transform_1.Vector.ScaleBy(transform_1.Vector.UpRight, this.speed * dt));
                break;
            case transform_1.DirEnum.Up:
                this.pos.y -= this.speed * dt;
                break;
            case (transform_1.DirEnum.DownLeft):
                this.pos.add(transform_1.Vector.ScaleBy(transform_1.Vector.DownLeft, this.speed * dt));
                break;
            case (transform_1.DirEnum.DownRight):
                this.pos.add(transform_1.Vector.ScaleBy(transform_1.Vector.DownRight, this.speed * dt));
                break;
            case transform_1.DirEnum.Down:
                this.pos.y += this.speed * dt;
                break;
            case transform_1.DirEnum.Left:
                this.pos.x -= this.speed * dt;
                break;
            case transform_1.DirEnum.Right:
                this.pos.x += this.speed * dt;
                break;
        }
        if (this.pos.x > 1000)
            this.pos.x = -30;
        if (this.pos.x < -30)
            this.pos.x = 1000;
        if (this.pos.y > 500)
            this.pos.y = -30;
        if (this.pos.y < -30)
            this.pos.y = 500;
    };
    Player.PLAYER_LIST = [];
    return Player;
}(transform_1.Transform));
exports.Player = Player;
/*

var Player = function(id: number){
    var self = {
        x: Math.random() * 1000,
        y: Math.random() * 500,
        speed:3,
        id:id,
        r : Math.random() * 255,
        g : Math.random() * 255,
        b : Math.random() * 255,
        dir:DirEnum.None,
        update: true,
        number : "" + Math.floor(10 * Math.random()),
        bullets:10,
        addBullet: function(){self.bullets++},
        removeBullet: function(){self.bullets--},

        setDirection: function(dir:DirEnum){
            self.dir = dir;
        },

        updatePosition: function(delta:number){
            if(self.update===true){

                switch(self.dir){
                    case(DirEnum.UpLeft):
                    case(DirEnum.UpRight):
                    case(DirEnum.Up):
                    self.y -= self.speed * delta;
                    break;
                    case(DirEnum.DownLeft):
                    case(DirEnum.DownRight):
                    case(DirEnum.Down):
                    self.y += self.speed * delta;
                    break;

                    case(DirEnum.Left):
                    self.x -= self.speed * delta;
                    break;
                    case(DirEnum.Right):
                    self.x += self.speed * delta;
                    break;
                }

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
*/

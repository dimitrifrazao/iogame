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
exports.Player = exports.PlayerState = void 0;
var transform_1 = require("./transform");
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Alive"] = 0] = "Alive";
    PlayerState[PlayerState["Stunned"] = 1] = "Stunned";
    PlayerState[PlayerState["Dead"] = 2] = "Dead";
})(PlayerState = exports.PlayerState || (exports.PlayerState = {}));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(id) {
        var _this = _super.call(this, 0, 0, 30, 30) || this;
        _this.id = id;
        _this.color = transform_1.Color.Random();
        _this.dir = transform_1.DirEnum.None;
        _this.speed = 3;
        _this.bullets = 10;
        _this.hp = 10;
        _this.state = PlayerState.Alive;
        _this.previousPos = new transform_1.Vector();
        return _this;
    }
    Player.prototype.TakeDamage = function (damage) {
        if (this.state == PlayerState.Alive) {
            this.hp -= damage;
            if (this.hp <= 0) {
                this.state = PlayerState.Dead;
                this.color = transform_1.Color.Red;
            }
        }
    };
    Player.prototype.SetDirection = function (dir) {
        this.dir = dir;
    };
    Player.prototype.RevertPositionUpdate = function () {
        this.pos.x = this.previousPos.x;
        this.pos.y = this.previousPos.y;
    };
    Player.prototype.UpdatePosition = function (dt) {
        if (this.state != PlayerState.Alive)
            return;
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
    Player.AddPlayer = function (player) { Player.PLAYER_LIST[player.id] = player; };
    Player.DeletePlayer = function (id) { delete Player.PLAYER_LIST[id]; };
    Player.GetPlayerById = function (id) { return Player.PLAYER_LIST[id]; };
    Player.GetPlayers = function () { return Player.PLAYER_LIST; };
    Player.UpdatePlayers = function (dt, pack) {
        for (var i in Player.PLAYER_LIST) {
            var player = Player.PLAYER_LIST[i];
            player.UpdatePosition(dt);
        }
        var toRevertPos = [];
        for (var i in Player.PLAYER_LIST) {
            var player = Player.PLAYER_LIST[i];
            for (var j in Player.PLAYER_LIST) {
                var player2 = Player.PLAYER_LIST[j];
                if (i != j && player.CheckCollision(player2) == true) {
                    player.TakeDamage(player.hp);
                    continue;
                }
            }
            pack.push({
                pos: player.GetTopLeftPos(),
                color: player.color,
                size: player.sizeX
            });
        }
    };
    Player.PLAYER_LIST = {};
    return Player;
}(transform_1.Transform));
exports.Player = Player;

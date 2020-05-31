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
exports.Player = exports.WeaponType = exports.PlayerplayerState = void 0;
var transform_1 = require("./transform");
var vector_1 = require("./vector");
var color_1 = require("./color");
var imove_1 = require("./interfaces/imove");
var world_1 = require("../main/world");
var PlayerplayerState;
(function (PlayerplayerState) {
    PlayerplayerState[PlayerplayerState["Alive"] = 0] = "Alive";
    PlayerplayerState[PlayerplayerState["Stunned"] = 1] = "Stunned";
    PlayerplayerState[PlayerplayerState["Dead"] = 2] = "Dead";
})(PlayerplayerState = exports.PlayerplayerState || (exports.PlayerplayerState = {}));
var WeaponType;
(function (WeaponType) {
    WeaponType[WeaponType["default"] = 0] = "default";
    WeaponType[WeaponType["shotgun"] = 1] = "shotgun";
    WeaponType[WeaponType["drop"] = 2] = "drop";
    WeaponType[WeaponType["knife"] = 3] = "knife";
})(WeaponType = exports.WeaponType || (exports.WeaponType = {}));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(id, name, deadCallback) {
        var _this = _super.call(this) || this;
        _this.hpMax = 11;
        _this.level = 1;
        _this.hp = _this.hpMax;
        _this.playerState = PlayerplayerState.Alive;
        _this.previousPos = new vector_1.Vector();
        _this.weaponType = WeaponType.default;
        // from IMove
        _this.dir = imove_1.DirEnum.None;
        _this.speed = 1;
        _this.push = new vector_1.Vector();
        // from IBulletManager
        _this.bullets = [];
        _this.size.x = 30;
        _this.size.y = 30;
        _this.id = id;
        _this.deadCallback = deadCallback;
        _this.SetColor(color_1.Color.Random());
        _this.type = transform_1.UnitType.Player;
        _this.name = name;
        return _this;
    }
    Player.prototype.Push = function (obj) { };
    ;
    Player.prototype.SetWeaponType = function (weaponType) { this.weaponType = weaponType; };
    ;
    Player.prototype.GetWeaponType = function () { return this.weaponType; };
    ;
    Player.prototype.GetWeaponData = function () {
        switch (this.weaponType) {
            case WeaponType.default: return { damage: 1, speed: 2, size: 10, timer: -1 };
            case WeaponType.shotgun: return { damage: 3, speed: 1, size: 20, timer: -1 };
            case WeaponType.drop: return { damage: 5, speed: 0, size: 5, timer: -1 };
            case WeaponType.knife: return { damage: 10, speed: 1, size: 10, timer: 10 };
        }
    };
    Player.prototype.AddBullet = function (bullet) {
        this.bullets.push(bullet);
    };
    Player.prototype.RemoveBullet = function (bullet) {
        var i = this.bullets.indexOf(bullet);
        delete this.bullets[i];
        this.bullets.splice(i, 1);
    };
    Player.prototype.RemovePlayer = function () {
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.RemovePlayer();
        }
        var id = this.GetId();
        var dPack = this.GetDataPack();
        dPack.SetColor(color_1.Color.Red);
        this.deadCallback(id, dPack);
        Player.DeletePlayer(id);
    };
    Player.prototype.LevelUp = function () {
        this.level++;
        this.hpMax++;
        this.hp++;
        this.size.x += 5;
        this.size.y += 5;
    };
    Player.prototype.AddHp = function (hp) {
        if (this.playerState != PlayerplayerState.Dead) {
            this.hp += hp;
            if (this.hp > this.hpMax) {
                this.hp = this.hpMax;
            }
        }
    };
    // from IPlayer
    Player.prototype.GetId = function () { return this.id; };
    ;
    Player.prototype.TakeDamage = function (damage) {
        if (this.playerState == PlayerplayerState.Alive) {
            this.hp -= damage;
            if (this.hp <= 0) {
                this.playerState = PlayerplayerState.Dead;
                this.RemovePlayer();
            }
        }
    };
    Player.prototype.IsAlive = function () { return this.playerState !== PlayerplayerState.Dead; };
    ;
    Player.prototype.GetTransform = function () { return this; };
    ;
    // player default 
    Player.prototype.GetDataPack = function () {
        var dPack = _super.prototype.GetDataPack.call(this);
        dPack.name = this.name;
        return dPack;
    };
    Player.prototype.SetDirection = function (dir) {
        this.dir = dir;
    };
    Player.prototype.RevertPositionUpdate = function () {
        this.pos.x = this.previousPos.x;
        this.pos.y = this.previousPos.y;
    };
    Player.prototype.UpdatePosition = function (dt) {
        if (this.playerState != PlayerplayerState.Alive)
            return;
        this.previousPos.x = this.pos.x;
        this.previousPos.y = this.pos.y;
        switch (this.dir) {
            case (imove_1.DirEnum.UpLeft):
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.UpLeft, this.speed * dt));
                break;
            case (imove_1.DirEnum.UpRight):
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.UpRight, this.speed * dt));
                break;
            case imove_1.DirEnum.Up:
                this.pos.y -= this.speed * dt;
                break;
            case (imove_1.DirEnum.DownLeft):
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.DownLeft, this.speed * dt));
                break;
            case (imove_1.DirEnum.DownRight):
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.DownRight, this.speed * dt));
                break;
            case imove_1.DirEnum.Down:
                this.pos.y += this.speed * dt;
                break;
            case imove_1.DirEnum.Left:
                this.pos.x -= this.speed * dt;
                break;
            case imove_1.DirEnum.Right:
                this.pos.x += this.speed * dt;
                break;
        }
        /*if(this.push.len() > 0.001){
            if(this.push.len() > 10){
                this.push.normalize();
                this.push.scaleBy(10);
            }
            this.pos.x += this.push.x * dt;
            this.pos.y += this.push.y * dt;
            this.push = Vector.Lerp(this.push, Vector.Zero, dt);
        }
        */
    };
    Player.AddPlayer = function (player) {
        Player.PLAYER_LIST[player.GetId()] = player;
    };
    Player.DeletePlayer = function (id) {
        delete Player.PLAYER_LIST[id];
    };
    Player.GetPlayerById = function (id) {
        var player = Player.PLAYER_LIST[id];
        if (player !== undefined)
            return player;
        return null;
    };
    Player.GetPlayers = function () { return Player.PLAYER_LIST; };
    Player.GetIPlayers = function () { return Player.PLAYER_LIST; };
    Player.UpdatePlayers = function (dt, pack) {
        for (var i in Player.PLAYER_LIST) {
            var player = Player.PLAYER_LIST[i];
            player.UpdatePosition(dt);
            player.CheckWorldWrap();
            // check collision against rocks
            var cells = world_1.World.inst.GetPossibleCollisions(player.pos);
            //console.log(cells.length);
            for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
                var cell = cells_1[_i];
                //pack.push(cell.GetDataPack());
                if (cell.IsRock() && player.CheckCollision(cell) == true) {
                    var overlap = player.GetOverlap(cell);
                    // pack.push(overlap.GetDataPack);
                    player.ApplyOverlapPush(overlap);
                }
            }
        }
        var deadPlayers = [];
        for (var i in Player.PLAYER_LIST) {
            var player = Player.PLAYER_LIST[i];
            for (var j in Player.PLAYER_LIST) {
                var player2 = Player.PLAYER_LIST[j];
                if (i != j && player.CheckCollision(player2) == true) {
                    deadPlayers.push(player);
                    continue;
                }
            }
            // back red square
            var playerRedPack = player.GetDataPack();
            playerRedPack.SetColor(color_1.Color.Red);
            pack.push(playerRedPack);
            // main player square that shrinks as hp lowers
            var playerPack = player.GetDataPack();
            playerPack.name = ""; // erase name so we dont have doubles
            playerPack.sy = player.size.y * (player.hp / player.hpMax);
            playerPack.y += player.size.y - playerPack.sy;
            pack.push(playerPack);
        }
        for (var _a = 0, deadPlayers_1 = deadPlayers; _a < deadPlayers_1.length; _a++) {
            var deadPlayer = deadPlayers_1[_a];
            deadPlayer.TakeDamage(deadPlayer.hp);
        }
    };
    Player.PLAYER_LIST = {};
    return Player;
}(transform_1.Transform));
exports.Player = Player;

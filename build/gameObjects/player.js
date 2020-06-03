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
exports.Player = exports.WeaponType = exports.PlayerState = void 0;
var transform_1 = require("./transform");
var vector_1 = require("./vector");
var color_1 = require("./color");
var imove_1 = require("./interfaces/imove");
var world_1 = require("../main/world");
var boundingBox_1 = require("./boundingBox");
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Alive"] = 0] = "Alive";
    PlayerState[PlayerState["Stunned"] = 1] = "Stunned";
    PlayerState[PlayerState["Dead"] = 2] = "Dead";
})(PlayerState = exports.PlayerState || (exports.PlayerState = {}));
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
        _this.playerState = PlayerState.Alive;
        _this.weaponType = WeaponType.default;
        _this.dashing = false;
        _this.dashBuffer = 0;
        _this.dashBufferMax = 100;
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
    Player.prototype.GetMoveVector = function () { return vector_1.Vector.Sub(this.pos, this.previousPos); };
    ;
    Player.prototype.SetWeaponType = function (weaponType) { this.weaponType = weaponType; };
    ;
    Player.prototype.GetWeaponType = function () { return this.weaponType; };
    ;
    Player.prototype.GetWeaponData = function () {
        switch (this.weaponType) {
            case WeaponType.default: return { damage: 1, speed: 2, size: 10, timer: -1 };
            case WeaponType.shotgun: return { damage: 3, speed: 1.7, size: 15, timer: -1 };
            case WeaponType.drop: return { damage: 5, speed: 1.4, size: 20, timer: -1 };
            case WeaponType.knife: return { damage: 7, speed: 1.1, size: 25, timer: -1 };
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
        if (this.playerState != PlayerState.Dead) {
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
        if (this.playerState == PlayerState.Alive) {
            this.hp -= damage;
            if (this.hp <= 0) {
                this.playerState = PlayerState.Dead;
                this.RemovePlayer();
            }
        }
    };
    Player.prototype.IsAlive = function () { return this.playerState !== PlayerState.Dead; };
    ;
    Player.prototype.GetTransform = function () { return this; };
    ;
    // player default 
    Player.prototype.SetPlayerState = function (state) { this.playerState = state; };
    ;
    Player.prototype.SetDash = function (state) {
        if (state && this.dashBuffer >= this.dashBufferMax)
            this.dashing = true;
        else if (state == false)
            this.dashing = false;
    };
    Player.prototype.IsDashing = function () { return this.dashing; };
    ;
    Player.prototype.GetDataPack = function () {
        var dPack = _super.prototype.GetDataPack.call(this);
        dPack.name = this.name;
        return dPack;
    };
    Player.prototype.SetDirection = function (dir) {
        this.dir = dir;
    };
    Player.prototype.UpdatePosition = function (dt) {
        if (this.playerState != PlayerState.Alive)
            return;
        this.SetPreviousPos(this.GetPos());
        var speed = this.speed;
        if (this.dashing) {
            speed = 2;
            this.dashBuffer -= dt * 0.5;
            if (this.dashBuffer < 0) {
                this.dashBuffer = 0;
                this.dashing = false;
                speed = this.speed;
            }
        }
        else {
            this.dashBuffer += dt * 0.05;
            if (this.dashBuffer >= this.dashBufferMax) {
                this.dashBuffer = this.dashBufferMax;
            }
        }
        switch (this.dir) {
            case (imove_1.DirEnum.UpLeft):
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.UpLeft, speed * dt));
                break;
            case (imove_1.DirEnum.UpRight):
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.UpRight, speed * dt));
                break;
            case imove_1.DirEnum.Up:
                this.pos.y -= speed * dt;
                break;
            case (imove_1.DirEnum.DownLeft):
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.DownLeft, speed * dt));
                break;
            case (imove_1.DirEnum.DownRight):
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.DownRight, speed * dt));
                break;
            case imove_1.DirEnum.Down:
                this.pos.y += speed * dt;
                break;
            case imove_1.DirEnum.Left:
                this.pos.x -= speed * dt;
                break;
            case imove_1.DirEnum.Right:
                this.pos.x += speed * dt;
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
                //let cpack = cell.GetDataPack();
                //cpack.SetColor(Color.Cyan);
                //pack.push(cpack);
                if (cell.IsRock() && player.CheckCollision(cell) == true) {
                    var overlapBB = boundingBox_1.BoundingBox.Sub(player.GetBoundingBox(), cell.GetBoundingBox());
                    if (overlapBB.GetSizeX() < overlapBB.GetSizeY()) {
                        if (player.pos.x > cell.GetPos().x)
                            player.pos.x += overlapBB.GetSizeX();
                        else
                            player.pos.x -= overlapBB.GetSizeX();
                    }
                    else {
                        if (player.pos.y > cell.GetPos().y)
                            player.pos.y += overlapBB.GetSizeY();
                        else
                            player.pos.y -= overlapBB.GetSizeY();
                    }
                    //let overlap = overlapBB.GetTransform();
                    //let oPack = overlap.GetDataPack();
                    //oPack.SetColor(Color.Magenta);
                    //pack.push(oPack);
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
            var bulletCounter = new transform_1.Transform();
            bulletCounter.SetPos(new vector_1.Vector(20 + (50 * (player.dashBuffer / player.dashBufferMax)), 20));
            bulletCounter.SetColor(color_1.Color.DarkGrey);
            if (player.dashBuffer >= player.dashBufferMax)
                bulletCounter.SetColor(color_1.Color.Grey);
            bulletCounter.SetSize(new vector_1.Vector(100 * (player.dashBuffer / player.dashBufferMax), 20));
            var bulletCounterPack = bulletCounter.GetDataPack();
            bulletCounterPack.id = player.id;
            bulletCounterPack.type = 3;
            pack.push(bulletCounterPack);
            var square = new transform_1.Transform();
            square.SetSize(new vector_1.Vector(20, 20));
            bulletCounter.SetColor(color_1.Color.DarkGrey);
            for (var si = 0; si < 4; si++) {
                square.SetPos(new vector_1.Vector(150 + (si * 40), 20));
                var sPack = square.GetDataPack();
                sPack.id = player.id;
                sPack.type = 3;
                sPack.SetColor(color_1.Color.DarkGrey);
                if (si == player.weaponType)
                    sPack.SetColor(color_1.Color.Grey);
                pack.push(sPack);
            }
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

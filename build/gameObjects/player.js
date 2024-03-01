"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
var quadTree_1 = require("./quadTree");
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Alive"] = 0] = "Alive";
    PlayerState[PlayerState["Stunned"] = 1] = "Stunned";
    PlayerState[PlayerState["Dead"] = 2] = "Dead";
})(PlayerState || (exports.PlayerState = PlayerState = {}));
var WeaponType;
(function (WeaponType) {
    WeaponType[WeaponType["default"] = 0] = "default";
    WeaponType[WeaponType["shotgun"] = 1] = "shotgun";
    WeaponType[WeaponType["drop"] = 2] = "drop";
    WeaponType[WeaponType["knife"] = 3] = "knife";
})(WeaponType || (exports.WeaponType = WeaponType = {}));
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
        _this.speed = Player.defaultSpeed;
        _this.push = new vector_1.Vector();
        // from IBulletManager
        _this.bullets = new Map();
        _this.size.x = 30;
        _this.size.y = 30;
        _this.id = id;
        _this.deadCallback = deadCallback;
        _this.SetColor(color_1.Color.PlayerRandomColor());
        _this.type = transform_1.UnitType.Player;
        _this.name = name;
        Player.PlayerMap.set(id, _this);
        return _this;
    }
    Player.prototype.Push = function (obj) { };
    Player.prototype.GetMoveVector = function () {
        return vector_1.Vector.Sub(this.pos, this.previousPos);
    };
    Player.prototype.SetWeaponType = function (weaponType) {
        this.weaponType = weaponType;
    };
    Player.prototype.GetWeaponType = function () {
        return this.weaponType;
    };
    Player.prototype.GetWeaponData = function () {
        switch (this.weaponType) {
            case WeaponType.default:
                return { damage: 1, speed: 0.4, size: 10, timer: -1 };
            case WeaponType.shotgun:
                return { damage: 3, speed: 0.3, size: 15, timer: -1 };
            case WeaponType.drop:
                return { damage: 5, speed: 0.2, size: 20, timer: -1 };
            case WeaponType.knife:
                return { damage: 7, speed: 0.1, size: 25, timer: -1 };
        }
    };
    Player.prototype.AddBullet = function (bullet) {
        this.bullets.set(bullet.GetId(), bullet);
    };
    Player.prototype.RemoveBullet = function (bullet) {
        this.bullets.delete(bullet.GetId());
    };
    Player.prototype.RemovePlayer = function () {
        this.bullets.forEach(function (bullet, bulletId) {
            bullet.Release();
        });
        var id = this.GetId();
        var dPack = this.GetDataPack();
        dPack.SetColor(color_1.Color.EmptyPlayer);
        this.deadCallback(id, dPack);
        if (!Player.PlayerMap.has(id)) {
            throw Error("trying to delete a non existing Player id");
        }
        Player.PlayerMap.delete(id);
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
    Player.prototype.GetId = function () {
        return this.id;
    };
    Player.prototype.TakeDamage = function (damage) {
        if (this.playerState == PlayerState.Alive) {
            this.hp -= damage;
            if (this.hp <= 0) {
                this.playerState = PlayerState.Dead;
                this.RemovePlayer();
            }
        }
    };
    Player.prototype.IsAlive = function () {
        return this.playerState !== PlayerState.Dead;
    };
    Player.prototype.GetTransform = function () {
        return this;
    };
    // player default
    Player.prototype.SetPlayerState = function (state) {
        this.playerState = state;
    };
    Player.prototype.SetDash = function (state) {
        if (state && this.dashBuffer >= this.dashBufferMax)
            this.dashing = true;
        else if (state == false)
            this.dashing = false;
    };
    Player.prototype.IsDashing = function () {
        return this.dashing;
    };
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
        if (this.dashing) {
            this.speed = 2 * Player.defaultSpeed;
            this.dashBuffer -= dt * 0.5;
            if (this.dashBuffer < 0) {
                this.dashBuffer = 0;
                this.dashing = false;
                this.speed = Player.defaultSpeed;
            }
        }
        else {
            this.dashBuffer += dt * 0.05;
            if (this.dashBuffer >= this.dashBufferMax) {
                this.dashBuffer = this.dashBufferMax;
            }
        }
        switch (this.dir) {
            case imove_1.DirEnum.UpLeft:
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.UpLeft, this.speed * dt));
                break;
            case imove_1.DirEnum.UpRight:
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.UpRight, this.speed * dt));
                break;
            case imove_1.DirEnum.Up:
                this.pos.y -= this.speed * dt;
                break;
            case imove_1.DirEnum.DownLeft:
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.DownLeft, this.speed * dt));
                break;
            case imove_1.DirEnum.DownRight:
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
    };
    Player.DeletePlayer = function (id) {
        var player = Player.GetPlayer(id);
        if (player !== null)
            player.RemovePlayer();
    };
    Player.GetPlayer = function (id) {
        var player = Player.PlayerMap.get(id);
        if (player !== undefined)
            return player;
        return null;
    };
    Player.UpdatePlayers = function (dt, pack) {
        Player.PlayerMap.forEach(function (player, id) {
            player.UpdatePosition(dt);
            player.CheckWorldWrap();
            // check collision against rocks
            var cells = world_1.World.inst.GetPossibleCollisions(player.GetPos());
            for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
                var cell = cells_1[_i];
                if (cell.GetCellType() === world_1.CellType.Rock &&
                    player.CheckCollision(cell) === true) {
                    var overlapBB = boundingBox_1.BoundingBox.Sub(player.GetBoundingBox(), cell.GetBoundingBox());
                    var op = overlapBB.GetDataPack();
                    op.SetColor(color_1.Color.Cyan);
                    pack.push(op);
                    var cpack = cell.GetDataPack();
                    cpack.SetColor(color_1.Color.Cyan);
                    pack.push(cpack);
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
                }
            }
            quadTree_1.QuadtreeNode.root.Insert(player);
        });
        var deadPlayers = [];
        Player.PlayerMap.forEach(function (player, id) {
            //let player = Player.PlayerMap[i];
            var transSet = new Set();
            var transforms = quadTree_1.QuadtreeNode.root.Retrieve(player);
            for (var i = 0; i < transforms.length; i++) {
                var transform = transforms[i];
                if (
                //!transSet.has(transform) &&
                transform.GetUnitType() === transform_1.UnitType.Player &&
                    transform.GetId() !== player.id &&
                    player.CheckCollision(transform)) {
                    transSet.add(transform);
                    deadPlayers.push(player);
                    continue;
                }
            }
            // back red square
            var playerRedPack = player.GetDataPack();
            playerRedPack.SetColor(color_1.Color.EmptyPlayer);
            pack.push(playerRedPack);
            // main player square that shrinks as hp lowers
            var playerPack = player.GetDataPack();
            playerPack.name = ""; // erase name so we dont have double moving up n down
            playerPack.sy = player.size.y * (player.hp / player.hpMax);
            playerPack.y += player.size.y - playerPack.sy;
            pack.push(playerPack);
            var dashUI = new transform_1.Transform();
            dashUI.SetPosValues(70, 20);
            dashUI.SetSizeValues(100, 20);
            dashUI.SetColor(color_1.Color.DarkGrey);
            var pashPack = dashUI.GetDataPack();
            pashPack.id = player.id;
            pashPack.type = 3;
            pack.push(pashPack);
            dashUI.SetColor(color_1.Color.Grey);
            if (player.dashBuffer >= player.dashBufferMax)
                dashUI.SetColor(color_1.Color.LightGrey);
            dashUI.SetPosValues(25 + 45 * (player.dashBuffer / player.dashBufferMax), 20);
            dashUI.SetSizeValues(90 * (player.dashBuffer / player.dashBufferMax), 10);
            pashPack = dashUI.GetDataPack();
            pashPack.id = player.id;
            pashPack.type = 3;
            pack.push(pashPack);
            var square = new transform_1.Transform();
            for (var si = 0; si < 4; si++) {
                square.SetSizeValues(20, 20);
                square.SetColor(color_1.Color.DarkGrey);
                square.SetPosValues(150 + si * 40, 20);
                var sPack = square.GetDataPack();
                sPack.id = player.id;
                sPack.type = 3;
                pack.push(sPack);
                if (si == player.weaponType) {
                    square.SetSizeValues(10, 10);
                    square.SetColor(color_1.Color.DarkGrey);
                    square.SetColor(color_1.Color.LightGrey);
                    sPack = square.GetDataPack();
                    sPack.id = player.id;
                    sPack.type = 3;
                    pack.push(sPack);
                }
            }
        });
        for (var _i = 0, deadPlayers_1 = deadPlayers; _i < deadPlayers_1.length; _i++) {
            var deadPlayer = deadPlayers_1[_i];
            deadPlayer.TakeDamage(deadPlayer.hp);
        }
    };
    Player.defaultSpeed = 0.3;
    Player.PlayerMap = new Map();
    return Player;
}(transform_1.Transform));
exports.Player = Player;

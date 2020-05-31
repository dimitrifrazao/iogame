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
exports.Bullet = void 0;
var transform_1 = require("./transform");
var vector_1 = require("./vector");
var world_1 = require("../main/world");
var imove_1 = require("./interfaces/imove");
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(player) {
        var _this = _super.call(this) || this;
        _this.damage = 1;
        _this.timer = -1;
        //IMove
        _this.dir = imove_1.DirEnum.None;
        _this.speed = 2;
        _this.push = new vector_1.Vector();
        _this.size.x = 10;
        _this.size.y = 10;
        _this.player = player;
        _this.id = _this.player.GetId();
        _this.type = transform_1.UnitType.Bullet;
        return _this;
    }
    Bullet.prototype.Push = function (obj) {
        var vec = vector_1.Vector.GetDirVector(this.dir);
        vec.scaleBy(3);
        obj.push.add(vec);
    };
    ;
    Bullet.prototype.GetPlayer = function () {
        if (this.player !== undefined)
            return this.player;
        return null;
    };
    Bullet.prototype.RemovePlayer = function () {
        delete this.player;
    };
    Bullet.prototype.RemoveBullet = function () {
        var player = this.GetPlayer();
        if (player != null)
            player.RemoveBullet(this);
    };
    // default
    Bullet.prototype.SetDirection = function (dir) { this.dir = dir; };
    Bullet.prototype.GetDirection = function () { return this.dir; };
    Bullet.prototype.SetSpeed = function (speed) { this.speed = speed; };
    Bullet.prototype.GetSpeed = function () { return this.speed; };
    Bullet.prototype.GetId = function () {
        var player = this.GetPlayer();
        if (player !== null)
            return player.GetId();
        return -1;
    };
    Bullet.prototype.UpdatePosition = function (dt) {
        switch (this.dir) {
            case (imove_1.DirEnum.Up):
                this.pos.y -= this.speed * dt;
                break;
            case (imove_1.DirEnum.Down):
                this.pos.y += this.speed * dt;
                break;
            case (imove_1.DirEnum.Left):
                this.pos.x -= this.speed * dt;
                break;
            case (imove_1.DirEnum.Right):
                this.pos.x += this.speed * dt;
                break;
        }
    };
    Bullet.AddBullet = function (bullet) {
        Bullet.BulletList.push(bullet);
    };
    Bullet.DeleteBullet = function (bullet) {
        var index = Bullet.BulletList.indexOf(bullet);
        delete Bullet.BulletList[index];
        Bullet.BulletList.splice(index, 1);
    };
    Bullet.GetBullets = function () { return Bullet.BulletList; };
    Bullet.UpdateBullets = function (dt, pack, players) {
        for (var _i = 0, _a = Bullet.BulletList; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.UpdatePosition(dt);
            bullet.CheckWorldWrap();
            var cells = world_1.World.inst.GetPossibleCollisions(bullet.pos);
            //console.log(cells.length);
            for (var i in cells) {
                var cell = cells[i];
                // FIX this, its bad
                //if(cell !== undefined ) console.log("DEAD CELL at " + i);
                if (cell !== undefined && cell.IsRock() && bullet.CheckCollision(cell) == true) {
                    var overlap = bullet.GetOverlap(cell);
                    bullet.ApplyOverlapPush(overlap);
                    bullet.dir = Bullet.GetMirrorDir(bullet.dir);
                }
            }
            pack.push(bullet.GetDataPack());
        }
        var deletedBullets = [];
        for (var _b = 0, _c = Bullet.BulletList; _b < _c.length; _b++) {
            var bullet = _c[_b];
            var deleteBullet = false;
            for (var _d = 0, _e = Bullet.BulletList; _d < _e.length; _d++) {
                var bullet2 = _e[_d];
                if (bullet !== bullet2 && bullet.CheckCollision(bullet2) === true) {
                    deleteBullet = true;
                    continue;
                }
            }
            var bulletPlayer = bullet.GetPlayer();
            for (var i in players) {
                var player = players[i];
                if (bullet.CheckCollision(player.GetTransform()) === true) {
                    if (bullet.id != player.GetId()) {
                        player.TakeDamage(bullet.damage);
                        if (!player.IsAlive() && bulletPlayer != null)
                            bulletPlayer.LevelUp();
                    }
                    deleteBullet = true;
                    //bullet.Push(player);
                }
            }
            if (bullet.timer >= 0) {
                console.log("timmer works");
                bullet.timer -= dt;
                if (bullet.timer <= 0)
                    deleteBullet = true;
            }
            if (deleteBullet) {
                deletedBullets.push(bullet);
                if (bulletPlayer != null)
                    bullet.player.AddHp(bullet.damage);
            }
        }
        for (var _f = 0, deletedBullets_1 = deletedBullets; _f < deletedBullets_1.length; _f++) {
            var bullet = deletedBullets_1[_f];
            Bullet.DeleteBullet(bullet);
        }
    };
    Bullet.BulletList = [];
    return Bullet;
}(transform_1.Transform));
exports.Bullet = Bullet;

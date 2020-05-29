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
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(owner, x, y) {
        var _this = _super.call(this, x, y, 10, 10) || this;
        _this.dir = transform_1.DirEnum.None;
        _this.speed = 2;
        _this.owner = owner;
        return _this;
    }
    Bullet.prototype.SetDirection = function (dir) { this.dir = dir; };
    Bullet.prototype.GetDirection = function () { return this.dir; };
    Bullet.prototype.SetSpeed = function (speed) { this.speed = speed; };
    Bullet.prototype.GetSpeed = function () { return this.speed; };
    Bullet.prototype.UpdatePosition = function (dt) {
        switch (this.dir) {
            case (transform_1.DirEnum.Up):
                this.pos.y -= this.speed * dt;
                break;
            case (transform_1.DirEnum.Down):
                this.pos.y += this.speed * dt;
                break;
            case (transform_1.DirEnum.Left):
                this.pos.x -= this.speed * dt;
                break;
            case (transform_1.DirEnum.Right):
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
            var cells = transform_1.World.inst.GetPossibleCollisions(bullet.pos);
            //console.log(cells.length);
            for (var _b = 0, cells_1 = cells; _b < cells_1.length; _b++) {
                var cell = cells_1[_b];
                /*pack.push({
                    pos: cell.GetTopLeftPos(),
                    color: Color.Blue,
                    sizeX:cell.sizeX,
                    sizeY:cell.sizeY
                });*/
                if (cell.IsRock() && bullet.CheckCollision(cell) == true) {
                    var overlap = bullet.GetOverlap(cell);
                    /*pack.push({
                        pos: overlap.GetTopLeftPos(),
                        color: Color.Green,
                        sizeX:overlap.sizeX,
                        sizeY:overlap.sizeY
                    });*/
                    bullet.ApplyOverlapPush(overlap);
                    bullet.dir = Bullet.GetMirrorDir(bullet.dir);
                }
            }
            pack.push({
                pos: bullet.GetTopLeftPos(),
                color: bullet.owner.color,
                sizeX: bullet.sizeX,
                sizeY: bullet.sizeY,
                id: bullet.owner.id
            });
        }
        var deletedBullets = [];
        for (var _c = 0, _d = Bullet.BulletList; _c < _d.length; _c++) {
            var bullet = _d[_c];
            var deleteBullet = false;
            for (var _e = 0, _f = Bullet.BulletList; _e < _f.length; _e++) {
                var bullet2 = _f[_e];
                if (bullet !== bullet2 && bullet.CheckCollision(bullet2) === true) {
                    deleteBullet = true;
                    continue;
                }
            }
            for (var k in players) {
                var player = players[k];
                if (bullet.CheckCollision(player) === true) {
                    if (bullet.owner.id != player.id) {
                        var killed = player.TakeDamage(1);
                        if (killed) {
                            bullet.owner.LevelUp();
                        }
                    }
                    deleteBullet = true;
                }
            }
            if (deleteBullet) {
                deletedBullets.push(bullet);
                bullet.owner.AddHp(1);
            }
        }
        for (var _g = 0, deletedBullets_1 = deletedBullets; _g < deletedBullets_1.length; _g++) {
            var bullet = deletedBullets_1[_g];
            Bullet.DeleteBullet(bullet);
        }
    };
    Bullet.BulletList = [];
    return Bullet;
}(transform_1.Transform));
exports.Bullet = Bullet;

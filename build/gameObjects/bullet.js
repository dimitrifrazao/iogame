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
        _this.speed = 4;
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
        if (this.pos.x > 1000)
            this.pos.x = -this.sizeX;
        if (this.pos.x < -this.sizeX)
            this.pos.x = 1000;
        if (this.pos.y > 500)
            this.pos.y = -this.sizeY;
        if (this.pos.y < -this.sizeY)
            this.pos.y = 500;
    };
    Bullet.AddBullet = function (bullet) {
        Bullet.BulletList.push(bullet);
    };
    Bullet.GetBullets = function () { return Bullet.BulletList; };
    Bullet.UpdateBullets = function (dt, pack, players) {
        for (var _i = 0, _a = Bullet.BulletList; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.UpdatePosition(dt);
            pack.push({
                pos: bullet.GetTopLeftPos(),
                color: transform_1.Color.Black,
                size: bullet.sizeX
            });
        }
        var updatedBullets = [];
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
            for (var k in players) {
                var player = players[k];
                if (bullet.CheckCollision(player) === true) {
                    if (bullet.owner.id != player.id) {
                        player.TakeDamage(1);
                    }
                    deleteBullet = true;
                }
            }
            if (deleteBullet === false) {
                updatedBullets.push(bullet);
            }
            else {
                bullet.owner.bullets++;
            }
        }
        Bullet.BulletList = updatedBullets;
    };
    Bullet.BulletList = [];
    return Bullet;
}(transform_1.Transform));
exports.Bullet = Bullet;

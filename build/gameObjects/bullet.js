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
    function Bullet(x, y, owner) {
        var _this = _super.call(this, x, y, 10, 10) || this;
        _this.dir = transform_1.DirEnum.None;
        _this.speed = 4;
        _this.index = -1;
        _this.owner = owner;
        return _this;
    }
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
    Bullet.AddBullet = function (owner, dir) {
        var bullet = new Bullet(owner.pos.x, owner.pos.y, owner);
        bullet.dir = dir;
        bullet.index = Bullet.BulletList.length;
        Bullet.BulletList.push(bullet);
    };
    Bullet.UpdateBullets = function (dt) {
        for (var _i = 0, _a = Bullet.BulletList; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.UpdatePosition(dt);
        }
    };
    Bullet.GetBulletData = function () {
        var bData = [];
        for (var _i = 0, _a = Bullet.BulletList; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bData.push({
                x: bullet.pos.x,
                y: bullet.pos.y,
                r: 255,
                g: 100,
                b: 0,
                size: bullet.sizeX
            });
        }
        return bData;
    };
    Bullet.BulletList = [];
    return Bullet;
}(transform_1.Transform));
exports.Bullet = Bullet;

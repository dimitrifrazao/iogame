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
    function Bullet(x, y, size, owner) {
        var _this = _super.call(this, x, y, size) || this;
        _this.dir = transform_1.DirEnum.None;
        _this.speed = 3;
        _this.index = -1;
        _this.owner = owner;
        return _this;
    }
    Bullet.prototype.updatePosition = function () {
        switch (this.dir) {
            case (transform_1.DirEnum.Up):
                this.y -= this.speed;
                break;
            case (transform_1.DirEnum.Down):
                this.y += this.speed;
                break;
            case (transform_1.DirEnum.Left):
                this.x -= this.speed;
                break;
            case (transform_1.DirEnum.Right):
                this.x += this.speed;
                break;
        }
        if (this.x > 1000)
            this.x = -this.size;
        if (this.x < -this.size)
            this.x = 1000;
        if (this.y > 500)
            this.y = -this.size;
        if (this.y < -this.size)
            this.y = 500;
    };
    Bullet.AddBullet = function (owner, dir) {
        console.log("bullet added");
        var bullet = new Bullet(owner.x, owner.y, 10, owner);
        bullet.index = Bullet.BulletList.length;
        bullet.dir = dir;
        Bullet.BulletList.push(bullet);
    };
    Bullet.DeleteBullet = function (bullet) {
        bullet.owner.addBullet();
        var index = bullet.index;
        delete Bullet.BulletList[index];
        Bullet.BulletList.splice(index, 1);
    };
    Bullet.UpdateBullets = function () {
        for (var _i = 0, _a = Bullet.BulletList; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.updatePosition();
        }
    };
    Bullet.GetBulletData = function () {
        var bData = [];
        for (var _i = 0, _a = Bullet.BulletList; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bData.push({
                x: bullet.x,
                y: bullet.y,
                r: 255,
                g: 100,
                b: 0,
                size: bullet.size
            });
        }
        return bData;
    };
    Bullet.BulletList = [];
    return Bullet;
}(transform_1.Transform));
exports.Bullet = Bullet;

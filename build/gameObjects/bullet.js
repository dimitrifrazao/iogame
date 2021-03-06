"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
var color_1 = require("./color");
var boundingBox_1 = require("./boundingBox");
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(player) {
        var _this = _super.call(this) || this;
        _this.damage = 1;
        _this.timer = -1;
        _this.isHP = false;
        _this.prevPos = new vector_1.Vector();
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
    Bullet.prototype.SetDamage = function (damage) {
        this.damage = damage;
        if (damage > 0) {
            var size = 7.5 + (damage * 2.5);
            this.size.x = size;
            this.size.y = size;
            this.speed = 2 - ((damage - 1) * 0.1);
            if (this.speed < 0)
                this.speed = 0;
        }
    };
    ;
    Bullet.prototype.GetDamage = function () { return this.damage; };
    ;
    Bullet.prototype.Push = function (obj) {
        var vec = vector_1.Vector.GetDirVector(this.dir);
        vec.scaleBy(3);
        obj.push.add(vec);
    };
    ;
    Bullet.prototype.GetMoveVector = function () { return vector_1.Vector.Sub(this.previousPos, this.pos); };
    ;
    Bullet.prototype.GetPlayer = function () {
        if (this.player !== undefined)
            return this.player;
        return null;
    };
    Bullet.prototype.RemovePlayer = function () {
        //delete this.player;
        this.isHP = true;
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
        this.SetPreviousPos(this.GetPos());
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
        if (this.isHP === true && this.speed > 0) {
            this.speed -= (dt * 0.01);
            this.color = color_1.Color.Lerp(this.color, color_1.Color.Red, (dt * 0.01));
            if (this.speed < 0)
                this.speed = 0;
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
            if (bullet.damage <= 0)
                continue;
            bullet.UpdatePosition(dt);
            bullet.CheckWorldWrap();
            var bbNow = bullet.GetBoundingBox();
            var bbOld = bullet.GetOldBoundingBox();
            //bbOld.OffsetBy(Vector.ScaleBy(bullet.GetMoveVector(), -1));
            var bbCombined = boundingBox_1.BoundingBox.Add(bbNow, bbOld);
            var bbTrans = bbCombined.GetTransform();
            if (false) { // render bb
                var tPack = bbTrans.GetDataPack();
                tPack.SetColor(color_1.Color.Green);
                tPack.id = -1;
                tPack.type = transform_1.UnitType.Bullet;
                pack.push(tPack);
            }
            var cells = world_1.World.inst.GetPossibleCollisions(bullet.pos);
            //console.log(cells.length);
            for (var i in cells) {
                var cell = cells[i];
                if (false) { // render cells
                    var cPack = cell.GetDataPack();
                    cPack.SetColor(new color_1.Color(0, 0, 0, 0.1));
                    cPack.type = transform_1.UnitType.Bullet;
                    pack.push(cPack);
                }
                if (cell.IsRock() && cell.CheckCollision(bbTrans) == true) {
                    var overlapBB = boundingBox_1.BoundingBox.Sub(bbCombined, cell.GetBoundingBox());
                    var overlap = overlapBB.GetTransform();
                    var vec = vector_1.Vector.ScaleBy(vector_1.Vector.GetDirVector(bullet.dir), -1.0001);
                    vec.mul(overlap.GetSize());
                    bullet.pos.add(vec);
                    if (false) { // render hiting cell
                        var cPack = cell.GetDataPack();
                        cPack.SetColor(color_1.Color.Magenta);
                        cPack.type = transform_1.UnitType.Bullet;
                        pack.push(cPack);
                    }
                    bullet.dir = Bullet.GetMirrorDir(bullet.dir);
                    if (false) { // render overlap
                        var oPack = overlap.GetDataPack();
                        oPack.SetColor(color_1.Color.Cyan);
                        pack.push(oPack);
                    }
                    break;
                }
            }
            pack.push(bullet.GetDataPack());
            var bulletPlayer = bullet.GetPlayer();
            for (var i in players) {
                var player = players[i];
                if (bullet.CheckCollision(player.GetTransform()) === true) {
                    if (bullet.id !== player.GetId()) {
                        if (bullet.isHP === true) {
                            player.AddHp(bullet.damage);
                        }
                        else {
                            player.TakeDamage(bullet.damage);
                            if (!player.IsAlive() && bulletPlayer != null)
                                bulletPlayer.LevelUp();
                        }
                    }
                    if (bulletPlayer !== null)
                        bulletPlayer.AddHp(bullet.damage);
                    bullet.damage = 0;
                    break;
                }
            }
            if (bullet.damage > 0) {
                for (var _b = 0, _c = Bullet.BulletList; _b < _c.length; _b++) {
                    var bullet2 = _c[_b];
                    if (bullet !== bullet2 && bullet2.damage > 0) {
                        bbCombined = boundingBox_1.BoundingBox.Add(bullet.GetBoundingBox(), bbOld);
                        bbTrans = bbCombined.GetTransform();
                        if (bbTrans.CheckCollision(bullet2) === true) {
                            var damage1 = bullet.damage;
                            var damage2 = bullet2.damage;
                            if (bullet.id !== bullet2.id) {
                                var bullet2Player = bullet2.GetPlayer();
                                if (damage1 >= damage2) {
                                    if (bullet2Player != null)
                                        bullet2Player.AddHp(damage2);
                                    bullet2.SetDamage(0);
                                }
                                else {
                                    if (bullet2Player != null)
                                        bullet2Player.AddHp(damage1);
                                    bullet2.SetDamage(damage2 - damage1);
                                }
                                if (damage2 >= damage1) {
                                    if (bulletPlayer != null)
                                        bulletPlayer.AddHp(damage1);
                                    bullet.SetDamage(0);
                                    break;
                                }
                                else {
                                    if (bulletPlayer != null)
                                        bulletPlayer.AddHp(damage2);
                                    bullet.SetDamage(damage1 - damage2);
                                }
                            }
                            else {
                                if (damage1 >= damage2) {
                                    bullet.SetDamage(damage1 + damage2);
                                    bullet2.SetDamage(0);
                                }
                                else {
                                    bullet.SetDamage(0);
                                    bullet2.SetDamage(damage1 + damage2);
                                }
                            }
                        }
                    }
                }
            }
            if (bullet.timer >= 0) {
                bullet.timer -= dt;
                if (bullet.timer <= 0)
                    bullet.damage = 0;
            }
        }
        for (var _d = 0, _e = Bullet.BulletList; _d < _e.length; _d++) {
            var bullet = _e[_d];
            if (bullet.damage <= 0) {
                bullet.RemoveBullet();
                Bullet.DeleteBullet(bullet);
            }
        }
    };
    Bullet.BulletList = [];
    return Bullet;
}(transform_1.Transform));
exports.Bullet = Bullet;

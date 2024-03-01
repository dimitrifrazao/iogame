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
exports.Bullet = void 0;
var transform_1 = require("./transform");
var vector_1 = require("./vector");
var world_1 = require("../main/world");
var imove_1 = require("./interfaces/imove");
var color_1 = require("./color");
var boundingBox_1 = require("./boundingBox");
var quadTree_1 = require("./quadTree");
function generateBulletID() {
    var currentDate = new Date();
    var timestamp = currentDate.getTime();
    var randomFactor = Math.floor(Math.random() * 10000);
    return timestamp + randomFactor;
}
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(player) {
        var _this = _super.call(this) || this;
        _this.player = player;
        _this.damage = 1;
        _this.prevPos = new vector_1.Vector();
        //IMove
        _this.dir = imove_1.DirEnum.None;
        _this.speed = Bullet.defaultSpeed;
        _this.push = new vector_1.Vector();
        _this.size.x = 10;
        _this.size.y = 10;
        _this.type = transform_1.UnitType.Bullet;
        _this.id = generateBulletID(); //this.player.GetId();
        var limit = 1000;
        while (limit >= 0) {
            if (!Bullet.BulletMap.has(_this.id))
                break;
            _this.id = generateBulletID();
            limit -= 1;
        }
        if (limit == 0)
            throw Error("failed to generate bullet id");
        Bullet.BulletMap.set(_this.id, _this);
        return _this;
    }
    Bullet.prototype.SetDamage = function (damage) {
        this.damage = damage;
        if (damage > 0) {
            var size = 7.5 + damage * 2.5;
            this.size.x = size;
            this.size.y = size;
            this.speed = Math.max(Bullet.defaultSpeed - (damage - 1) * 0.1, 0.0);
        }
    };
    Bullet.prototype.GetDamage = function () {
        return this.damage;
    };
    Bullet.prototype.Push = function (obj) {
        var vec = vector_1.Vector.GetDirVector(this.dir);
        vec.scaleBy(3);
        obj.push.add(vec);
    };
    Bullet.prototype.GetMoveVector = function () {
        return vector_1.Vector.Sub(this.previousPos, this.pos);
    };
    Bullet.prototype.GetPlayer = function () {
        return this.player;
    };
    // IPlayerObserver
    Bullet.prototype.GetPlayerManager = function () {
        if (this.player !== null)
            return this.player;
        return null;
    };
    Bullet.prototype.Release = function () {
        var playerManager = this.GetPlayerManager();
        if (playerManager !== null) {
            playerManager.RemoveBullet(this);
            this.player = null;
        }
    };
    // default
    Bullet.prototype.SetDirection = function (dir) {
        this.dir = dir;
    };
    Bullet.prototype.GetDirection = function () {
        return this.dir;
    };
    Bullet.prototype.SetSpeed = function (speed) {
        this.speed = speed;
    };
    Bullet.prototype.GetSpeed = function () {
        return this.speed;
    };
    Bullet.prototype.GetId = function () {
        return this.id;
    };
    Bullet.prototype.UpdatePosition = function (dt) {
        this.SetPreviousPos(this.GetPos());
        switch (this.dir) {
            case imove_1.DirEnum.Up:
                this.pos.y -= this.speed * dt;
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
        if (this.player === null && this.speed > 0) {
            this.speed -= dt * 0.01;
            this.color = color_1.Color.Lerp(this.color, color_1.Color.Red, dt * 0.01);
            if (this.speed < 0)
                this.speed = 0;
        }
    };
    Bullet.DeleteBullet = function (bullet) {
        bullet.Release();
        if (!Bullet.BulletMap.has(bullet.GetId())) {
            throw Error("tried to delete an non existing bullet id");
        }
        Bullet.BulletMap.delete(bullet.GetId());
    };
    Bullet.UpdateBullets = function (dt, pack) {
        Bullet.BulletMap.forEach(function (bullet, id) {
            if (bullet.damage > 0) {
                bullet.UpdatePosition(dt);
                bullet.CheckWorldWrap();
                var bbCombined = bullet.GetCombinedBoundingBox();
                var p = bbCombined.GetDataPack();
                p.SetColor(color_1.Color.Blue);
                //pack.push(p);
                // check against rocks
                var dirFlipped = null;
                var cells = world_1.World.inst.GetPossibleCollisions(bullet.GetPos());
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    if (cell.GetCellType() === world_1.CellType.Rock &&
                        cell.CheckCollision(bbCombined.GetTransform()) === true) {
                        var cpack = cell.GetDataPack();
                        cpack.SetColor(color_1.Color.Cyan);
                        pack.push(cpack);
                        var overlapBB = boundingBox_1.BoundingBox.Sub(bbCombined, cell.GetBoundingBox());
                        var overlap = overlapBB.GetTransform();
                        var vec = vector_1.Vector.ScaleBy(vector_1.Vector.GetDirVector(bullet.dir), -1.0001);
                        vec.mul(overlap.GetSize());
                        bullet.pos.add(vec);
                        if (dirFlipped === null) {
                            dirFlipped = Bullet.GetMirrorDir(bullet.dir);
                        }
                        //continue;
                    }
                }
                if (dirFlipped !== null)
                    bullet.dir = dirFlipped;
            }
            quadTree_1.QuadtreeNode.root.Insert(bullet);
            pack.push(bullet.GetDataPack());
        });
        // compare to quadtree neighboors
        var toDeleteBullets = [];
        Bullet.BulletMap.forEach(function (bullet, id) {
            if (bullet.GetDamage() === 0) {
                toDeleteBullets.push(bullet);
            }
            else {
                var bulletPlayer = bullet.GetPlayer();
                var bbCombined = bullet.GetCombinedBoundingBox();
                var p = bbCombined.GetDataPack();
                p.SetColor(color_1.Color.Black);
                //pack.push(p);
                var transSet = new Set();
                var transforms = quadTree_1.QuadtreeNode.root.Retrieve(bullet);
                for (var i = 0; i < transforms.length; i++) {
                    var transform = transforms[i];
                    // skip if is same bullet
                    if (transform.GetId() === bullet.GetId())
                        continue;
                    // skip already visited
                    if (transSet.has(transform.GetId()))
                        continue;
                    transSet.add(transform.GetId());
                    // is player collision
                    if (transform.GetUnitType() === transform_1.UnitType.Player) {
                        // skip if no overlap
                        if (!transform.CheckCollision(bullet))
                            continue;
                        var player = transform;
                        if (!player.IsAlive())
                            continue; // skip if dead
                        if (bulletPlayer !== null &&
                            player.GetId() === bulletPlayer.GetId()) {
                            player.AddHp(bullet.GetDamage());
                            bullet.SetDamage(0);
                            toDeleteBullets.push(bullet);
                            //console.log("bullet touched own player");
                            break;
                        }
                        else if (bulletPlayer !== null &&
                            player.GetId() !== bulletPlayer.GetId()) {
                            player.TakeDamage(bullet.GetDamage());
                            if (!player.IsAlive())
                                bulletPlayer.LevelUp();
                            bulletPlayer.AddHp(bullet.GetDamage());
                            //console.log("bullet touched other player");
                            bullet.SetDamage(0);
                            toDeleteBullets.push(bullet);
                            break;
                        }
                        else if (bulletPlayer === null) {
                            //console.log("stray bullet touched other player");
                            player.AddHp(bullet.GetDamage());
                            bullet.SetDamage(0);
                            toDeleteBullets.push(bullet);
                            break;
                        }
                        else {
                            //console.log("hitting bullet to player collision edge case");
                        }
                        // bullet collision
                    }
                    else if (transform.GetUnitType() === transform_1.UnitType.Bullet) {
                        var otherBullet = transform;
                        // skip if zeroed
                        if (otherBullet.GetDamage() === 0)
                            continue;
                        // skip when not colliding
                        var tbbCombined = transform.GetCombinedBoundingBox();
                        if (!bbCombined
                            .GetTransform()
                            .CheckCollision(tbbCombined.GetTransform())) {
                            continue;
                        }
                        // other bullet hit!
                        var bullet2Player = otherBullet.GetPlayer();
                        var damage1 = bullet.GetDamage();
                        var damage2 = otherBullet.GetDamage();
                        // one or two are stray, combine!
                        if (bulletPlayer === null && bullet2Player === null) {
                            otherBullet.SetDamage(damage1 + damage2);
                            bullet.SetDamage(0);
                            toDeleteBullets.push(bullet);
                            break;
                        }
                        else if (bulletPlayer === null) {
                            otherBullet.SetDamage(damage1 + damage2);
                            bullet.SetDamage(0);
                            toDeleteBullets.push(bullet);
                            break;
                        }
                        else if (bullet2Player === null) {
                            bullet.SetDamage(damage1 + damage2);
                            bullet.SetDamage(0);
                            toDeleteBullets.push(bullet);
                            break;
                        }
                        else {
                            // both have players
                            if (bulletPlayer.GetId() !== bullet2Player.GetId()) {
                                if (damage1 > damage2) {
                                    if (bullet2Player !== null)
                                        bullet2Player.AddHp(damage2);
                                    if (bulletPlayer !== null)
                                        bulletPlayer.AddHp(damage2);
                                    otherBullet.SetDamage(0);
                                    bullet.SetDamage(damage1 - damage2);
                                }
                                else if (damage1 < damage2) {
                                    if (bullet2Player !== null)
                                        bullet2Player.AddHp(damage1);
                                    if (bulletPlayer !== null)
                                        bulletPlayer.AddHp(damage1);
                                    otherBullet.SetDamage(damage2 - damage1);
                                    bullet.SetDamage(0);
                                    toDeleteBullets.push(bullet);
                                    break;
                                }
                                else {
                                    if (bullet2Player !== null)
                                        bullet2Player.AddHp(damage2);
                                    if (bulletPlayer !== null)
                                        bulletPlayer.AddHp(damage1);
                                    otherBullet.SetDamage(0);
                                    bullet.SetDamage(0);
                                    toDeleteBullets.push(bullet);
                                    break;
                                }
                            }
                            else {
                                // hitting same player bullet
                                otherBullet.SetDamage(damage1 + damage2);
                                bullet.SetDamage(0);
                                toDeleteBullets.push(bullet);
                                break;
                            }
                        }
                    }
                    else {
                        console.log("bullet hitting uknown type");
                        console.log(transform);
                    }
                }
            }
        });
        for (var _i = 0, toDeleteBullets_1 = toDeleteBullets; _i < toDeleteBullets_1.length; _i++) {
            var bullet = toDeleteBullets_1[_i];
            Bullet.DeleteBullet(bullet);
        }
    };
    Bullet.defaultSpeed = 0.4;
    Bullet.BulletMap = new Map();
    return Bullet;
}(transform_1.Transform));
exports.Bullet = Bullet;

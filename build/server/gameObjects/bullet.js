"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
const transform_1 = require("./transform");
const vector_1 = require("../../shared/vector");
const world_1 = require("../mainGame/world");
const playerInput_1 = require("../../shared/enums/playerInput");
const color_1 = require("../../shared/color");
const boundingBox_1 = require("../../shared/boundingBox");
const quadTree_1 = require("./quadTree");
const global_1 = require("../mainGame/global");
const unitType_1 = require("../../shared/enums/unitType");
function generateBulletID() {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const randomFactor = Math.floor(Math.random() * 10000);
    return timestamp + randomFactor;
}
class Bullet extends transform_1.Transform {
    constructor(player) {
        super();
        this.player = player;
        this.damage = 1;
        this.prevPos = new vector_1.Vector();
        //IMove
        this.dir = playerInput_1.DirEnum.None;
        this.speed = Bullet.defaultSpeed;
        this.push = new vector_1.Vector();
        this.color = player !== null ? player.GetColor() : color_1.Color.Cyan;
        this.size.x = 10;
        this.size.y = 10;
        this.unitType = unitType_1.UnitType.Bullet;
        this.id = generateBulletID(); //this.player.GetId();
        let limit = 1000;
        while (limit >= 0) {
            if (!Bullet.BulletMap.has(this.id))
                break;
            this.id = generateBulletID();
            limit -= 1;
        }
        if (limit == 0)
            throw Error("failed to generate bullet id");
        Bullet.BulletMap.set(this.id, this);
    }
    SetDamage(damage) {
        this.damage = damage;
        if (damage > 0 && this.player !== null && this.player.hpMax !== 0) {
            let size = (damage * 20) / 9 + 70 / 9;
            let lerp = damage / (this.player.hpMax - 1);
            this.size.x = size;
            this.size.y = size;
            this.speed = Bullet.lowestSpeed * lerp + Bullet.defaultSpeed * (1 - lerp);
        }
    }
    GetDamage() {
        return this.damage;
    }
    Push(obj) {
        let vec = vector_1.Vector.GetDirVector(this.dir);
        vec.scaleBy(3);
        obj.push.add(vec);
    }
    GetMoveVector() {
        return vector_1.Vector.Sub(this.previousPos, this.pos);
    }
    GetPlayer() {
        return this.player;
    }
    // IPlayerObserver
    GetPlayerManager() {
        if (this.player !== null)
            return this.player;
        return null;
    }
    Release() {
        let playerManager = this.GetPlayerManager();
        if (playerManager !== null) {
            playerManager.RemoveBullet(this);
        }
        this.player = null;
    }
    Shoot(dir) {
        if (this.player === null)
            return;
        this.SetDamage(this.player.GetWeaponDamage());
        let pos = this.player.GetPos();
        pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.GetDirVector(dir), this.player.GetSize().x / 2 + this.GetSize().x / 2));
        this.SetPos(pos);
        this.SetDirection(dir);
    }
    // default
    SetDirection(dir) {
        this.dir = dir;
    }
    GetDirection() {
        return this.dir;
    }
    SetSpeed(speed) {
        this.speed = speed;
    }
    GetSpeed() {
        return this.speed;
    }
    GetId() {
        return this.id;
    }
    UpdatePosition(dt) {
        this.SetPreviousPos(this.GetPos());
        switch (this.dir) {
            case playerInput_1.DirEnum.Up:
                this.pos.y -= this.speed * dt;
                break;
            case playerInput_1.DirEnum.Down:
                this.pos.y += this.speed * dt;
                break;
            case playerInput_1.DirEnum.Left:
                this.pos.x -= this.speed * dt;
                break;
            case playerInput_1.DirEnum.Right:
                this.pos.x += this.speed * dt;
                break;
        }
        if (this.player === null && this.speed > 0) {
            this.speed -= Bullet.slowDownSpeed;
            let lerp = Math.max(Math.min(1.0 - this.speed, 1.0), 0.0);
            this.color = color_1.Color.Lerp(this.color, color_1.Color.Red, lerp);
            if (this.speed < 0)
                this.speed = 0;
        }
    }
    static DeleteBullet(bullet) {
        bullet.Release();
        if (!Bullet.BulletMap.has(bullet.GetId())) {
            console.log("ERROR: tried to delete an non existing bullet id");
        }
        Bullet.BulletMap.delete(bullet.GetId());
    }
    static UpdateBullets(dt, pack) {
        Bullet.BulletMap.forEach((bullet, id) => {
            if (bullet.damage > 0) {
                bullet.UpdatePosition(dt);
                bullet.CheckWorldWrap();
                let bbCombined = bullet.GetCombinedBoundingBox();
                // check against rocks
                let dirFlipped = null;
                let cells = world_1.World.inst.GetPossibleCollisions(bullet.GetPos());
                for (let i = 0; i < cells.length; i++) {
                    let cell = cells[i];
                    if (cell.GetCellType() === world_1.CellType.Rock &&
                        cell.CheckCollision(transform_1.Transform.MakeFromBoundingBox(bbCombined)) ===
                            true) {
                        if (global_1.Global.debugToggle) {
                            let cpack = cell.GetDataPack();
                            cpack.SetUnitType(unitType_1.UnitType.Bullet);
                            cpack.SetColor(color_1.Color.Cyan);
                            pack.push(cpack);
                        }
                        let overlapBB = boundingBox_1.BoundingBox.Sub(bbCombined, cell.GetBoundingBox());
                        let overlap = transform_1.Transform.MakeFromBoundingBox(overlapBB);
                        let vec = vector_1.Vector.ScaleBy(vector_1.Vector.GetDirVector(bullet.dir), -1.0001);
                        vec.mul(overlap.GetSize());
                        bullet.pos.add(vec);
                        if (dirFlipped === null) {
                            dirFlipped = Bullet.GetMirrorDir(bullet.dir);
                        }
                    }
                }
                if (dirFlipped !== null)
                    bullet.dir = dirFlipped;
            }
            quadTree_1.QuadtreeNode.root.Insert(bullet);
            //pack.push(bullet.GetDataPack());
        });
        // compare to quadtree neighboors
        let toDeleteBullets = new Set();
        Bullet.BulletMap.forEach((bullet, id) => {
            if (bullet.GetDamage() === 0) {
                toDeleteBullets.add(bullet);
            }
            else {
                let bulletPlayer = bullet.GetPlayer();
                let bbCombined = bullet.GetCombinedBoundingBox();
                if (global_1.Global.debugToggle) {
                    let dbugBB = bullet.GetBoundingBox();
                    let p = transform_1.Transform.MakeFromBoundingBox(bbCombined).GetDataPack();
                    p.SetUnitType(unitType_1.UnitType.Bullet);
                    p.SetColor(color_1.Color.DarkGrey);
                    pack.push(p);
                    p = transform_1.Transform.MakeFromBoundingBox(dbugBB).GetDataPack();
                    p.SetUnitType(unitType_1.UnitType.Bullet);
                    p.SetColor(color_1.Color.Magenta);
                    pack.push(p);
                }
                else {
                    let dataPack = transform_1.Transform.MakeFromBoundingBox(bbCombined).GetDataPack();
                    dataPack.SetColor(bullet.GetColor());
                    dataPack.SetUnitType(unitType_1.UnitType.Bullet);
                    pack.push(dataPack);
                }
                let transforms = quadTree_1.QuadtreeNode.root.Retrieve(bullet);
                // maybe wrap in a function and return when bulet hits?
                transforms.forEach((transform) => {
                    if (transform.GetId() !== bullet.GetId() && bullet.GetDamage() > 0) {
                        // is player collision
                        if (transform.GetUnitType() === unitType_1.UnitType.Player) {
                            let player = transform;
                            if (player.CheckCollision(bullet) && player.IsAlive()) {
                                // same player
                                if (bulletPlayer !== null &&
                                    player.GetId() === bulletPlayer.GetId()) {
                                    player.AddHp(bullet.GetDamage());
                                    bullet.SetDamage(0);
                                    toDeleteBullets.add(bullet);
                                    //console.log("bullet touched own player");
                                }
                                else if (bulletPlayer !== null &&
                                    player.GetId() !== bulletPlayer.GetId()) {
                                    player.TakeDamage(bullet.GetDamage());
                                    if (!player.IsAlive())
                                        bulletPlayer.LevelUp();
                                    bulletPlayer.AddHp(bullet.GetDamage());
                                    //console.log("bullet touched other player");
                                    bullet.SetDamage(0);
                                    toDeleteBullets.add(bullet);
                                }
                                else if (bulletPlayer === null) {
                                    //console.log("stray bullet touched other player");
                                    player.AddHp(bullet.GetDamage());
                                    bullet.SetDamage(0);
                                    toDeleteBullets.add(bullet);
                                }
                                else {
                                    console.log("hitting bullet to player collision edge case");
                                }
                            }
                            // bullet collision
                        }
                        else if (transform.GetUnitType() === unitType_1.UnitType.Bullet) {
                            let otherBullet = transform;
                            let tbbCombined = transform.GetCombinedBoundingBox();
                            if (bbCombined.CheckCollision(tbbCombined)) {
                                // other bullet hit!
                                let bullet2Player = otherBullet.GetPlayer();
                                let damage1 = bullet.GetDamage();
                                let damage2 = otherBullet.GetDamage();
                                // one or two are stray, combine!
                                if (bulletPlayer === null && bullet2Player === null) {
                                    if (damage1 > damage2) {
                                        bullet.SetDamage(damage1 + damage2);
                                        otherBullet.SetDamage(0);
                                    }
                                    else {
                                        otherBullet.SetDamage(damage1 + damage2);
                                        bullet.SetDamage(0);
                                        toDeleteBullets.add(bullet);
                                    }
                                }
                                else if (bulletPlayer === null) {
                                    otherBullet.SetDamage(damage1 + damage2);
                                    bullet.SetDamage(0);
                                    toDeleteBullets.add(bullet);
                                }
                                else if (bullet2Player === null) {
                                    bullet.SetDamage(damage1 + damage2);
                                    otherBullet.SetDamage(0);
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
                                            toDeleteBullets.add(bullet);
                                        }
                                        else {
                                            if (bullet2Player !== null)
                                                bullet2Player.AddHp(damage2);
                                            if (bulletPlayer !== null)
                                                bulletPlayer.AddHp(damage1);
                                            otherBullet.SetDamage(0);
                                            bullet.SetDamage(0);
                                            toDeleteBullets.add(bullet);
                                        }
                                    }
                                    else {
                                        // hitting same player bullet
                                        if (damage1 > damage2) {
                                            bullet.SetDamage(damage1 + damage2);
                                            otherBullet.SetDamage(0);
                                        }
                                        else {
                                            otherBullet.SetDamage(damage1 + damage2);
                                            bullet.SetDamage(0);
                                            toDeleteBullets.add(bullet);
                                            transforms.clear();
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            console.log("bullet hitting uknown type");
                            console.log(transform);
                        }
                    }
                });
                transforms.clear();
            }
        });
        toDeleteBullets.forEach((toDeleteBullet) => {
            Bullet.DeleteBullet(toDeleteBullet);
        });
        toDeleteBullets.clear();
    }
}
exports.Bullet = Bullet;
Bullet.defaultSpeed = 0.4;
Bullet.lowestSpeed = 0.000001;
Bullet.slowDownSpeed = 0.01;
Bullet.BulletMap = new Map();

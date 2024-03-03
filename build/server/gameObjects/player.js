"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.PlayerState = void 0;
const transform_1 = require("./transform");
const vector_1 = require("../../shared/vector");
const color_1 = require("../../shared/color");
const playerInput_1 = require("../../shared/enums/playerInput");
const world_1 = require("../mainGame/world");
const boundingBox_1 = require("../../shared/boundingBox");
const quadTree_1 = require("./quadTree");
const weapons_1 = require("../../shared/enums/weapons");
const global_1 = require("../mainGame/global");
const unitType_1 = require("../../shared/enums/unitType");
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Alive"] = 0] = "Alive";
    PlayerState[PlayerState["Stunned"] = 1] = "Stunned";
    PlayerState[PlayerState["Dead"] = 2] = "Dead";
})(PlayerState || (exports.PlayerState = PlayerState = {}));
class Player extends transform_1.Transform {
    constructor(id, name, deadCallback) {
        super();
        this.hpMax = 11;
        this.level = 1;
        this.hp = this.hpMax;
        this.playerState = PlayerState.Alive;
        this.weaponType = weapons_1.WeaponType.default;
        this.dashing = false;
        this.dashBuffer = 0;
        this.dashBufferMax = 100;
        this.emitUpdate = false;
        // from IMove
        this.dir = playerInput_1.DirEnum.None;
        this.speed = Player.defaultSpeed;
        this.push = new vector_1.Vector();
        // from IBulletManager
        this.bullets = new Map();
        this.size.x = 30;
        this.size.y = 30;
        this.id = id;
        this.deadCallback = deadCallback;
        this.SetColor(color_1.Color.PlayerRandomColor());
        this.unitType = unitType_1.UnitType.Player;
        this.name = name;
        Player.PlayerMap.set(id, this);
    }
    SetPlayerGameData(gameData) {
        if (this.emitUpdate) {
            gameData.data.push(this.hp);
            gameData.data.push(this.level);
            this.emitUpdate = false;
        }
        gameData.data.push(this.pos.y);
        gameData.data.push(this.pos.x);
    }
    Push(obj) { }
    GetMoveVector() {
        return vector_1.Vector.Sub(this.pos, this.previousPos);
    }
    SetWeaponType(weaponType) {
        this.weaponType = weaponType;
        this.emitUpdate = true;
    }
    GetWeaponType() {
        return this.weaponType;
    }
    GetWeaponData() {
        switch (this.weaponType) {
            case weapons_1.WeaponType.default:
                return 1;
            case weapons_1.WeaponType.shotgun:
                return 3;
            case weapons_1.WeaponType.drop:
                return 5;
            case weapons_1.WeaponType.knife:
                return 7;
        }
    }
    GetWeaponDamage() {
        return this.GetWeaponData();
    }
    CanShoot() {
        let damage = this.GetWeaponDamage();
        let hasHP = this.hp >= 1 + damage;
        //let maxOverHP = this.bullets.keys.length <= this.hpMax * 2;
        return hasHP && !this.IsDashing();
    }
    AddBullet(bullet, dir) {
        this.bullets.set(bullet.GetId(), bullet);
        this.TakeDamage(this.GetWeaponDamage());
        bullet.Shoot(dir);
    }
    RemoveBullet(bullet) {
        this.bullets.delete(bullet.GetId());
    }
    RemovePlayer() {
        console.log("Removing player: " + this.name);
        this.bullets.forEach((bullet, bulletId) => {
            bullet.Release();
        });
        this.bullets.clear();
        let id = this.GetId();
        let dPack = this.GetDataPack();
        dPack.SetColor(color_1.Color.EmptyPlayer);
        this.deadCallback(id, dPack);
        if (!Player.PlayerMap.has(id)) {
            console.log("ERROR: trying to delete a non existing Player id");
        }
        Player.PlayerMap.delete(id);
    }
    LevelUp() {
        this.level++;
        this.hpMax++;
        this.hp++;
        this.size.x += 5;
        this.size.y += 5;
        this.emitUpdate = true;
    }
    AddHp(hp) {
        if (this.playerState != PlayerState.Dead) {
            this.hp += hp;
            if (this.hp > this.hpMax) {
                this.hp = this.hpMax;
            }
            this.emitUpdate = true;
        }
    }
    // from IPlayer
    GetId() {
        return this.id;
    }
    TakeDamage(damage) {
        if (this.playerState == PlayerState.Alive) {
            this.hp -= damage;
            if (this.hp <= 0) {
                this.playerState = PlayerState.Dead;
                this.RemovePlayer();
            }
            this.emitUpdate = true;
        }
    }
    IsAlive() {
        return this.playerState !== PlayerState.Dead;
    }
    GetTransform() {
        return this;
    }
    // player default
    SetPlayerState(state) {
        this.playerState = state;
        this.emitUpdate = true;
    }
    SetDash(state) {
        if (state && this.dashBuffer >= this.dashBufferMax) {
            this.dashing = true;
        }
        else if (state === false) {
            this.dashing = false;
        }
    }
    IsDashing() {
        return this.dashing === true;
    }
    GetDataPack() {
        let dPack = super.GetDataPack();
        dPack.name = this.name;
        return dPack;
    }
    SetDirection(dir) {
        this.dir = dir;
    }
    UpdatePosition(dt) {
        if (this.playerState != PlayerState.Alive)
            return;
        this.SetPreviousPos(this.GetPos());
        if (this.dashing) {
            if (this.dashBuffer > 0) {
                this.speed = 2 * Player.defaultSpeed;
                this.dashBuffer -= dt * 0.5;
                this.emitUpdate = true;
            }
            else {
                this.speed = Player.defaultSpeed;
                this.dashBuffer = 0;
                this.dashing = false;
                this.speed = Player.defaultSpeed;
            }
        }
        else {
            if (this.dashBuffer < this.dashBufferMax) {
                this.dashBuffer += dt * 0.05;
                this.emitUpdate = true;
            }
            if (this.dashBuffer >= this.dashBufferMax) {
                this.dashBuffer = this.dashBufferMax;
            }
        }
        switch (this.dir) {
            case playerInput_1.DirEnum.UpLeft:
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.UpLeft, this.speed * dt));
                break;
            case playerInput_1.DirEnum.UpRight:
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.UpRight, this.speed * dt));
                break;
            case playerInput_1.DirEnum.Up:
                this.pos.y -= this.speed * dt;
                break;
            case playerInput_1.DirEnum.DownLeft:
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.DownLeft, this.speed * dt));
                break;
            case playerInput_1.DirEnum.DownRight:
                this.pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.DownRight, this.speed * dt));
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
    }
    static DeletePlayer(id) {
        let player = Player.GetPlayer(id);
        if (player !== null)
            player.RemovePlayer();
    }
    static GetPlayer(id) {
        let player = Player.PlayerMap.get(id);
        if (player !== undefined)
            return player;
        return null;
    }
    static UpdatePlayers(dt, pack) {
        Player.PlayerMap.forEach((player, id) => {
            player.UpdatePosition(dt);
            player.CheckWorldWrap();
            // check collision against rocks
            let cells = world_1.World.inst.GetPossibleCollisions(player.GetPos());
            for (let cell of cells) {
                if (cell.GetCellType() === world_1.CellType.Rock &&
                    player.CheckCollision(cell) === true) {
                    let overlapBB = boundingBox_1.BoundingBox.Sub(player.GetBoundingBox(), cell.GetBoundingBox());
                    if (global_1.Global.debugToggle) {
                        let cpack = cell.GetDataPack();
                        cpack.SetUnitType(unitType_1.UnitType.Player);
                        cpack.SetColor(color_1.Color.Cyan);
                        pack.push(cpack);
                        let op = transform_1.Transform.MakeFromBoundingBox(overlapBB).GetDataPack();
                        op.SetColor(color_1.Color.Orange);
                        pack.push(op);
                    }
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
        let deadPlayers = new Set();
        Player.PlayerMap.forEach((player, id) => {
            let transforms = quadTree_1.QuadtreeNode.root.Retrieve(player);
            transforms.forEach((transform) => {
                if (transform.GetUnitType() === unitType_1.UnitType.Player &&
                    transform.GetId() !== player.id &&
                    player.CheckCollision(transform)) {
                    deadPlayers.add(player);
                }
            });
            transforms.clear();
            // back red square
            let playerRedPack = player.GetDataPack();
            playerRedPack.SetColor(color_1.Color.EmptyPlayer);
            playerRedPack.id = -1;
            pack.push(playerRedPack);
            // main player square that shrinks as hp lowers
            let playerPack = player.GetDataPack();
            playerPack.name = ""; // erase name so we dont have double moving up n down
            playerPack.sy = player.size.y * (player.hp / player.hpMax);
            playerPack.y += playerPack.sx - playerPack.sy;
            pack.push(playerPack);
        });
        deadPlayers.forEach((deadPlayer) => {
            deadPlayer.TakeDamage(deadPlayer.hp);
        });
        deadPlayers.clear();
    }
}
exports.Player = Player;
Player.defaultSpeed = 0.3;
Player.startSize = 30;
Player.PlayerMap = new Map();

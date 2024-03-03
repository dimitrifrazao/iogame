"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const world_1 = require("./world");
const vector_1 = require("../../shared/vector");
const player_1 = require("../gameObjects/player");
const bullet_1 = require("../gameObjects/bullet");
const quadTree_1 = require("../gameObjects/quadTree");
const clientRequests_1 = require("../../shared/enums/clientRequests");
const global_1 = require("./global");
const data_1 = require("../../shared/data");
class Game {
    constructor() {
        this.timeScale = 1.0;
        this.dt = 0.0;
        this.lastUpdate = Date.now();
    }
    Init() {
        let h = 60;
        let v = 40;
        let s = 30;
        global_1.Global.unitSize = s;
        new world_1.World(h, v, s);
        world_1.World.inst.Build();
        let center = world_1.World.inst.GetWorldCenter();
        let size = world_1.World.inst.GetWorldSize();
        quadTree_1.QuadtreeNode.capacity = 1;
        quadTree_1.QuadtreeNode.depthLimit = 4;
        quadTree_1.QuadtreeNode.root = new quadTree_1.QuadtreeNode(center, size);
    }
    Tick() {
        let now = Date.now();
        this.dt = now - this.lastUpdate;
        this.lastUpdate = now;
    }
    GetDeltaTime() {
        return this.dt * this.timeScale;
    }
    EmitWorldData() {
        return world_1.World.inst.GetWorldData();
    }
    AddPlayer(id, name, EmitDeadPlayer) {
        var player = new player_1.Player(id, name, EmitDeadPlayer);
        // can spawn on rock?
        player.SetPos(new vector_1.Vector(Math.random() * world_1.World.inst.GetHorizontalSize(), Math.random() * world_1.World.inst.GetVerticalSize()));
    }
    DeletePlayer(id) {
        player_1.Player.DeletePlayer(id);
    }
    SetPlayerDir(id, dir) {
        let player = player_1.Player.GetPlayer(id);
        if (player != null)
            player.SetDirection(dir);
    }
    Shoot(id, dir) {
        let player = player_1.Player.GetPlayer(id);
        if (player !== null && player.CanShoot()) {
            let bullet = new bullet_1.Bullet(player);
            player.AddBullet(bullet, dir);
        }
    }
    Dash(id, dashState) {
        let player = player_1.Player.GetPlayer(id);
        if (player != null)
            player.SetDash(dashState);
    }
    ChangeWeapon(id, type) {
        let player = player_1.Player.GetPlayer(id);
        if (player != null)
            player.SetWeaponType(type);
    }
    ClientRequest(id, data) {
        switch (data.type) {
            case clientRequests_1.ClientRequestEnum.debugToggle:
                global_1.Global.debugToggle = !global_1.Global.debugToggle;
                break;
        }
    }
    GetPlayerData(id) {
        let gameData = new data_1.GameData(data_1.GameDataType.PlayerData);
        let player = player_1.Player.GetPlayer(id);
        if (player !== null) {
            player.SetPlayerGameData(gameData);
        }
        return gameData;
    }
    Update() {
        let pack = [];
        let dt = this.GetDeltaTime();
        quadTree_1.QuadtreeNode.root.Clear();
        player_1.Player.UpdatePlayers(dt, pack);
        bullet_1.Bullet.UpdateBullets(dt, pack);
        if (global_1.Global.debugToggle) {
            quadTree_1.QuadtreeNode.root.AddDataPacks(pack); // draw quad tree
        }
        if (global_1.Global.debugToggle) {
            let frameRate = new data_1.GameData(data_1.GameDataType.FrameRate);
            frameRate.data.push(dt);
            pack.push(frameRate);
        }
        return pack;
    }
}
exports.Game = Game;
Game.inst = new Game();

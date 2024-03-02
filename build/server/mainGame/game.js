"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var world_1 = require("./world");
var vector_1 = require("../../shared/vector");
var player_1 = require("../gameObjects/player");
var bullet_1 = require("../gameObjects/bullet");
var quadTree_1 = require("../gameObjects/quadTree");
var clientRequests_1 = require("../../shared/enums/clientRequests");
var global_1 = require("./global");
var Game = /** @class */ (function () {
    function Game() {
        this.timeScale = 1.0;
        this.dt = 0.0;
        this.lastUpdate = Date.now();
    }
    Game.prototype.Init = function () {
        var h = 60;
        var v = 40;
        var s = 30;
        global_1.Global.unitSize = s;
        world_1.World.inst = new world_1.World(h, v, s);
        world_1.World.inst.Build();
        var center = world_1.World.inst.GetWorldCenter();
        var size = world_1.World.inst.GetWorldSize();
        quadTree_1.QuadtreeNode.capacity = 1;
        quadTree_1.QuadtreeNode.depthLimit = 4;
        quadTree_1.QuadtreeNode.root = new quadTree_1.QuadtreeNode(center, size);
    };
    Game.prototype.Tick = function () {
        var now = Date.now();
        this.dt = now - this.lastUpdate;
        this.lastUpdate = now;
    };
    Game.prototype.GetDeltaTime = function () {
        return this.dt * this.timeScale;
    };
    Game.prototype.AddPlayer = function (id, name, EmitDeadPlayer) {
        var player = new player_1.Player(id, name, EmitDeadPlayer);
        // can spawn on rock?
        player.SetPos(new vector_1.Vector(Math.random() * world_1.World.inst.GetHorizontalSize(), Math.random() * world_1.World.inst.GetVerticalSize()));
    };
    Game.prototype.DeletePlayer = function (id) {
        player_1.Player.DeletePlayer(id);
    };
    Game.prototype.SetPlayerDir = function (id, dir) {
        var player = player_1.Player.GetPlayer(id);
        if (player != null)
            player.SetDirection(dir);
    };
    Game.prototype.Shoot = function (id, dir) {
        var player = player_1.Player.GetPlayer(id);
        if (player != null) {
            var damageData = player.GetWeaponData();
            var hasHP = player.hp >= 1 + damageData.damage;
            var maxOverHP = player.bullets.keys.length <= player.hpMax * 2;
            if (hasHP && maxOverHP && !player.IsDashing()) {
                var pos = vector_1.Vector.Copy(player.GetPos());
                var bullet = new bullet_1.Bullet(player);
                bullet.SetDamage(damageData.damage);
                bullet.speed = damageData.speed;
                //bullet.SetSize( new Vector(damageData.size, damageData.size) );
                bullet.SetColor(player.GetColor());
                pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.GetDirVector(dir), player.GetSize().x / 2 + bullet.GetSize().x / 2));
                bullet.SetPos(pos);
                bullet.SetDirection(dir);
                player.AddBullet(bullet);
                player.TakeDamage(damageData.damage);
            }
        }
    };
    Game.prototype.Dash = function (id, dashState) {
        var player = player_1.Player.GetPlayer(id);
        if (player != null)
            player.SetDash(dashState);
    };
    Game.prototype.ChangeWeapon = function (id, type) {
        var player = player_1.Player.GetPlayer(id);
        if (player != null)
            player.SetWeaponType(type);
    };
    Game.prototype.ClientRequest = function (id, data) {
        switch (data.type) {
            case clientRequests_1.ClientRequestEnum.debugToggle:
                global_1.Global.debugToggle = !global_1.Global.debugToggle;
                break;
        }
    };
    Game.prototype.Update = function () {
        var pack = [];
        var dt = this.GetDeltaTime();
        quadTree_1.QuadtreeNode.root.Clear();
        player_1.Player.UpdatePlayers(dt, pack);
        bullet_1.Bullet.UpdateBullets(dt, pack);
        if (global_1.Global.debugToggle) {
            quadTree_1.QuadtreeNode.root.AddDataPacks(pack); // draw quad tree
        }
        //pack.push({ dt: dt });
        return pack;
    };
    Game.inst = new Game();
    return Game;
}());
exports.Game = Game;

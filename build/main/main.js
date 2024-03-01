"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
var world_1 = require("./world");
var vector_1 = require("../gameObjects/vector");
var player_1 = require("../gameObjects/player");
var bullet_1 = require("../gameObjects/bullet");
var quadTree_1 = require("../gameObjects/quadTree");
var Main = /** @class */ (function () {
    function Main() {
        this.timeScale = 1.0;
        this.dt = 0.0;
        this.lastUpdate = Date.now();
    }
    Main.prototype.Init = function () {
        var h = 60;
        var v = 40;
        var s = 30;
        world_1.World.inst = new world_1.World(h, v, s);
        world_1.World.inst.Build();
        var center = world_1.World.inst.GetWorldCenter();
        var size = world_1.World.inst.GetWorldSize();
        quadTree_1.QuadtreeNode.capacity = 1;
        quadTree_1.QuadtreeNode.depthLimit = 4;
        quadTree_1.QuadtreeNode.root = new quadTree_1.QuadtreeNode(center, size);
    };
    Main.prototype.Tick = function () {
        var now = Date.now();
        this.dt = now - this.lastUpdate;
        this.lastUpdate = now;
    };
    Main.prototype.GetDeltaTime = function () {
        return this.dt * this.timeScale;
    };
    Main.prototype.AddPlayer = function (id, name, EmitDeadPlayer) {
        var player = new player_1.Player(id, name, EmitDeadPlayer);
        // can spawn on rock?
        player.SetPos(new vector_1.Vector(Math.random() * world_1.World.inst.GetHorizontalSize(), Math.random() * world_1.World.inst.GetVerticalSize()));
    };
    Main.prototype.DeletePlayer = function (id) {
        player_1.Player.DeletePlayer(id);
    };
    Main.prototype.SetPlayerDir = function (id, dir) {
        var player = player_1.Player.GetPlayer(id);
        if (player != null)
            player.SetDirection(dir);
    };
    Main.prototype.Shoot = function (id, dir) {
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
    Main.prototype.Dash = function (id, dashState) {
        var player = player_1.Player.GetPlayer(id);
        if (player != null)
            player.SetDash(dashState);
    };
    Main.prototype.ChangeWeapon = function (id, type) {
        var player = player_1.Player.GetPlayer(id);
        if (player != null)
            player.SetWeaponType(type);
    };
    Main.prototype.Update = function () {
        var pack = [];
        var dt = this.GetDeltaTime();
        quadTree_1.QuadtreeNode.root.Clear();
        player_1.Player.UpdatePlayers(dt, pack);
        bullet_1.Bullet.UpdateBullets(dt, pack);
        quadTree_1.QuadtreeNode.root.AddDataPacks(pack); // draw quad tree
        pack.push({ dt: dt });
        return pack;
    };
    Main.inst = new Main();
    return Main;
}());
exports.Main = Main;

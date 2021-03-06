"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
var world_1 = require("./world");
var vector_1 = require("../gameObjects/vector");
var player_1 = require("../gameObjects/player");
var bullet_1 = require("../gameObjects/bullet");
var Main = /** @class */ (function () {
    function Main() {
        this.timeScale = 0.2;
        this.dt = 0;
        this.lastUpdate = Date.now();
    }
    Main.prototype.Init = function () {
        world_1.World.inst.Build();
    };
    Main.prototype.Tick = function () {
        var now = Date.now();
        this.dt = now - this.lastUpdate;
        this.lastUpdate = now;
    };
    Main.prototype.SetDeltaTime = function (dt) { this.dt = dt; };
    ;
    Main.prototype.GetDeltaTime = function () { return this.dt * this.timeScale; };
    ;
    Main.prototype.AddPlayer = function (id, name, EmitDeadPlayer) {
        var player = new player_1.Player(id, name, EmitDeadPlayer);
        player.SetPos(new vector_1.Vector(Math.random() * world_1.World.inst.GetHorizontalSize(), Math.random() * world_1.World.inst.GetVerticalSize()));
        player_1.Player.AddPlayer(player);
    };
    ;
    Main.prototype.GetPlayerPosBy = function (id) { return player_1.Player.GetPlayerById(id); };
    ;
    Main.prototype.DeletePlayer = function (id) { player_1.Player.DeletePlayer(id); };
    ;
    Main.prototype.SetPlayerDir = function (id, dir) {
        var player = player_1.Player.GetPlayerById(id);
        if (player != null)
            player.SetDirection(dir);
    };
    Main.prototype.Shoot = function (id, dir) {
        var player = player_1.Player.GetPlayerById(id);
        if (player != null) {
            var damageData = player.GetWeaponData();
            var hasHP = player.hp >= (1 + damageData.damage);
            var maxOverHP = (player.bullets.length <= (player.hpMax * 2));
            if (hasHP && maxOverHP && !player.IsDashing()) {
                var pos = vector_1.Vector.Copy(player.GetPos());
                var bullet = new bullet_1.Bullet(player);
                bullet.SetDamage(damageData.damage);
                bullet.speed = damageData.speed;
                bullet.timer = damageData.timer;
                //bullet.SetSize( new Vector(damageData.size, damageData.size) );
                bullet.SetColor(player.GetColor());
                pos.add(vector_1.Vector.ScaleBy(vector_1.Vector.GetDirVector(dir), (player.GetSize().x / 2) + (bullet.GetSize().x / 2)));
                bullet.SetPos(pos);
                bullet.SetDirection(dir);
                bullet_1.Bullet.AddBullet(bullet);
                player.AddBullet(bullet);
                player.TakeDamage(damageData.damage);
            }
        }
    };
    Main.prototype.Dash = function (id, dashState) {
        var player = player_1.Player.GetPlayerById(id);
        if (player != null)
            player.SetDash(dashState);
    };
    Main.prototype.ChangeWeapon = function (id, type) {
        var player = player_1.Player.GetPlayerById(id);
        if (player != null)
            player.SetWeaponType(type);
    };
    Main.prototype.Update = function () {
        var pack = [];
        var dt = this.GetDeltaTime();
        player_1.Player.UpdatePlayers(dt, pack);
        bullet_1.Bullet.UpdateBullets(dt, pack, player_1.Player.GetIPlayers());
        return pack;
    };
    Main.inst = new Main();
    return Main;
}());
exports.Main = Main;

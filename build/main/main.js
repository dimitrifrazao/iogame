"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
var bullet_1 = require("../gameObjects/bullet");
var transform_1 = require("../gameObjects/transform");
var player_1 = require("../gameObjects/player");
var Main = /** @class */ (function () {
    function Main() {
        this.dt = 0;
        this.lastUpdate = Date.now();
    }
    Main.prototype.Tick = function () {
        var now = Date.now();
        this.dt = now - this.lastUpdate;
        this.lastUpdate = now;
    };
    Main.prototype.SetDeltaTime = function (dt) { this.dt = dt; };
    ;
    Main.prototype.GetDeltaTime = function () { return this.dt; };
    ;
    Main.prototype.AddPlayer = function (id) {
        var player = new player_1.Player(id);
        player.pos.x = Math.random() * 1000;
        player.pos.y = Math.random() * 500;
        player_1.Player.AddPlayer(player);
    };
    ;
    Main.prototype.DeletePlayer = function (id) { player_1.Player.DeletePlayer(id); };
    ;
    Main.prototype.SetPlayerDir = function (id, dir) {
        var player = player_1.Player.GetPlayerById(id);
        player.SetDirection(dir);
    };
    Main.prototype.Shoot = function (id, dir) {
        var player = player_1.Player.GetPlayerById(id);
        if (player.bullets > 0) {
            var pos = transform_1.Vector.Copy(player.pos);
            var bullet = new bullet_1.Bullet(player, pos.x, pos.y);
            bullet.pos.add(transform_1.Vector.ScaleBy(transform_1.Vector.GetDirVector(dir), (player.sizeX / 2) + (bullet.sizeX / 2)));
            bullet.SetDirection(dir);
            bullet_1.Bullet.AddBullet(bullet);
            player.bullets--;
        }
    };
    Main.prototype.Update = function () {
        var pack = [];
        player_1.Player.UpdatePlayers(this.dt, pack);
        bullet_1.Bullet.UpdateBullets(this.dt, pack, player_1.Player.GetPlayers());
        return pack;
    };
    Main.inst = new Main();
    return Main;
}());
exports.Main = Main;

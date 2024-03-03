"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerData = void 0;
const weapons_1 = require("./enums/weapons");
const color_1 = require("./color");
class PlayerData {
    constructor(hp, size) {
        this.hp = hp;
        this.size = size;
        this.weaponType = weapons_1.WeaponType.default;
        this.dashBarValue = 100;
        this.color = color_1.Color.PlayerRandom();
    }
}
exports.PlayerData = PlayerData;

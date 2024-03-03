"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerData = void 0;
var weapons_1 = require("../../shared/enums/weapons");
var PlayerData = /** @class */ (function () {
    function PlayerData() {
    }
    PlayerData.weaponType = weapons_1.WeaponType.default;
    PlayerData.dashBarValue = 100;
    return PlayerData;
}());
exports.PlayerData = PlayerData;

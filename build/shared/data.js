"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPack = void 0;
var unitType_1 = require("./enums/unitType");
var DataPack = /** @class */ (function () {
    function DataPack() {
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 255;
        this.sx = 0;
        this.sy = 0;
        this.id = 0;
        this.type = unitType_1.UnitType.None;
        this.name = "";
    }
    DataPack.prototype.SetPos = function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    };
    DataPack.prototype.SetColor = function (color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    };
    return DataPack;
}());
exports.DataPack = DataPack;

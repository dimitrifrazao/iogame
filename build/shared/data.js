"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPack = exports.DataType = void 0;
var unitType_1 = require("./enums/unitType");
var vector_1 = require("./vector");
var color_1 = require("./color");
var DataType;
(function (DataType) {
})(DataType || (exports.DataType = DataType = {}));
var DataPack = /** @class */ (function () {
    function DataPack() {
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 1;
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
    DataPack.prototype.GetPos = function () {
        return new vector_1.Vector(this.x, this.y);
    };
    DataPack.prototype.GetSize = function () {
        return new vector_1.Vector(this.sx, this.sy);
    };
    DataPack.prototype.SetColor = function (color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    };
    DataPack.prototype.GetColor = function () {
        return new color_1.Color(this.r, this.g, this.b, this.a);
    };
    DataPack.Cast = function (obj) {
        var dp = new DataPack();
        dp.x = obj.x;
        dp.y = obj.y;
        dp.r = obj.r;
        dp.g = obj.g;
        dp.b = obj.b;
        dp.a = obj.a;
        dp.sx = obj.sx;
        dp.sy = obj.sy;
        dp.id = obj.id;
        dp.type = obj.type;
        dp.name = obj.name;
        return dp;
    };
    return DataPack;
}());
exports.DataPack = DataPack;

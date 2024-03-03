"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPack = exports.GameData = exports.GameDataType = exports.DataType = void 0;
const unitType_1 = require("./enums/unitType");
const vector_1 = require("./vector");
const color_1 = require("./color");
var DataType;
(function (DataType) {
    DataType[DataType["GameData"] = 0] = "GameData";
    DataType[DataType["DataPack"] = 1] = "DataPack";
})(DataType || (exports.DataType = DataType = {}));
class Data {
    constructor(type) {
        this.type = type;
        this.type = type;
    }
}
var GameDataType;
(function (GameDataType) {
    GameDataType[GameDataType["WorldData"] = 0] = "WorldData";
    GameDataType[GameDataType["PlayerData"] = 1] = "PlayerData";
    GameDataType[GameDataType["GameData"] = 2] = "GameData";
    GameDataType[GameDataType["FrameRate"] = 3] = "FrameRate";
})(GameDataType || (exports.GameDataType = GameDataType = {}));
class GameData extends Data {
    constructor(gameDataType) {
        super(DataType.GameData);
        this.gameDataType = gameDataType;
        this.data = [];
    }
    static Cast(obj) {
        let gameData = new GameData(obj.gameDataType);
        gameData.data = obj.data;
        return gameData;
    }
}
exports.GameData = GameData;
class DataPack extends Data {
    constructor() {
        super(DataType.DataPack);
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 1;
        this.sx = 0;
        this.sy = 0;
        this.id = 0;
        this.unitType = unitType_1.UnitType.None;
        this.name = "";
    }
    GetPos() {
        return new vector_1.Vector(this.x, this.y);
    }
    GetSize() {
        return new vector_1.Vector(this.sx, this.sy);
    }
    GetColor() {
        return new color_1.Color(this.r, this.g, this.b, this.a);
    }
    SetPos(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }
    SetSize(size) {
        this.sx = size.x;
        this.sy = size.y;
    }
    SetColor(color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }
    SetUnitType(unitType) {
        this.unitType = unitType;
    }
    static Cast(obj) {
        let dp = new DataPack();
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
        dp.unitType = obj.unitType;
        dp.name = obj.name;
        return dp;
    }
}
exports.DataPack = DataPack;

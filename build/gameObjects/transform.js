"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellType = exports.Cell = exports.Transform = exports.DataPack = exports.UnitType = void 0;
var world_1 = require("../main/world");
var vector_1 = require("./vector");
var color_1 = require("./color");
var imove_1 = require("./interfaces/imove");
var gameObject_1 = require("./gameObject");
var boundingBox_1 = require("./boundingBox");
var UnitType;
(function (UnitType) {
    UnitType[UnitType["None"] = 0] = "None";
    UnitType[UnitType["Player"] = 1] = "Player";
    UnitType[UnitType["Bullet"] = 2] = "Bullet";
})(UnitType = exports.UnitType || (exports.UnitType = {}));
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
        this.type = UnitType.None;
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
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    function Transform() {
        var _this = _super.call(this) || this;
        _this.id = -1;
        _this.type = UnitType.None;
        _this.pos = new vector_1.Vector();
        _this.size = new vector_1.Vector(1, 1);
        _this.color = color_1.Color.Grey;
        return _this;
    }
    Transform.prototype.GetId = function () { return this.id; };
    ;
    ;
    Transform.prototype.GetUnitType = function () { return this.type; };
    ;
    Transform.prototype.SetPos = function (pos) { this.pos = pos; };
    ;
    Transform.prototype.GetPos = function () { return this.pos; };
    ;
    Transform.prototype.SetSize = function (size) { this.size = size; };
    ;
    Transform.prototype.GetSize = function () { return this.size; };
    ;
    Transform.prototype.SetColor = function (color) { this.color = color; };
    ;
    Transform.prototype.GetColor = function () { return this.color; };
    ;
    Transform.prototype.GetBoundingBox = function () { return boundingBox_1.BoundingBox.MakeFrom(this); };
    ;
    Transform.prototype.GetDataPack = function () {
        var dPack = new DataPack();
        dPack.SetPos(this.GetTopLeftPos());
        dPack.SetColor(this.GetColor());
        dPack.sx = this.size.x,
            dPack.sy = this.size.y,
            dPack.id = this.GetId(),
            dPack.type = this.GetUnitType();
        return dPack;
    };
    Transform.prototype.CheckCollision = function (trans) {
        return (Math.abs(this.pos.x - trans.pos.x) < (this.size.x + trans.size.y) / 2) &&
            (Math.abs(this.pos.y - trans.pos.y) < (this.size.y + trans.size.y) / 2);
    };
    ;
    Transform.prototype.GetOverlap = function (trans) {
        /*let overLapPos = Vector.GetInbetween(this.pos, trans.pos);
        let overlapSize = new Vector();
        overlapSize.x = Math.min( Math.abs(this.GetBotRightPos().x - trans.GetTopLeftPos().x), Math.abs(this.GetTopLeftPos().x - trans.GetBotRightPos().x));
        overlapSize.y = Math.min( Math.abs(this.GetBotRightPos().y - trans.GetTopLeftPos().y), Math.abs(this.GetTopLeftPos().y - trans.GetBotRightPos().y));
        let overlap = new Transform();
        overlap.SetPos(overLapPos);
        overlap.SetSize(overlapSize);*/
        var bb1 = this.GetBoundingBox();
        var bb2 = trans.GetBoundingBox();
        var bb3 = boundingBox_1.BoundingBox.Sub(bb1, bb2);
        return bb3.GetTransform();
    };
    Transform.prototype.ApplyBulletOverlapPush = function (bulletStretch, overlap) {
        if (bulletStretch.size.x > bulletStretch.size.y) {
            this.pos.x -= overlap.size.x;
        }
        else {
            this.pos.x -= overlap.size.y;
        }
    };
    Transform.prototype.GetTopLeftPos = function () {
        return new vector_1.Vector(this.pos.x - (this.size.x / 2), this.pos.y - (this.size.y / 2));
    };
    ;
    Transform.prototype.GetBotRightPos = function () {
        return new vector_1.Vector(this.pos.x + (this.size.x / 2), this.pos.y + (this.size.y / 2));
    };
    Transform.prototype.GetArea = function () {
        return this.size.x * this.size.y;
    };
    Transform.prototype.CheckWorldWrap = function () {
        world_1.World.inst.WorldWrap(this.pos);
        /*if(this.pos.x > World.inst.GetHorizontalSize()) this.pos.x = 0;
        else if(this.pos.x < 0) this.pos.x = World.inst.GetHorizontalSize();
        if(this.pos.y > World.inst.GetVerticalSize()) this.pos.y = 0;
        if(this.pos.y < 0) this.pos.y = World.inst.GetVerticalSize();*/
    };
    Transform.GetMirrorDir = function (dir) {
        switch (dir) {
            case imove_1.DirEnum.Left: return imove_1.DirEnum.Right;
            case imove_1.DirEnum.Right: return imove_1.DirEnum.Left;
            case imove_1.DirEnum.Up: return imove_1.DirEnum.Down;
            case imove_1.DirEnum.Down: return imove_1.DirEnum.Up;
            case imove_1.DirEnum.UpLeft: return imove_1.DirEnum.DownRight;
            case imove_1.DirEnum.UpRight: return imove_1.DirEnum.DownLeft;
        }
        return imove_1.DirEnum.None;
    };
    return Transform;
}(gameObject_1.GameObject));
exports.Transform = Transform;
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell() {
        var _this = _super.call(this) || this;
        _this.cellType = CellType.Empty;
        return _this;
    }
    ;
    Cell.prototype.IsRock = function () { return this.cellType == CellType.Rock; };
    Cell.prototype.GetDataPack = function () {
        var dPack = _super.prototype.GetDataPack.call(this);
        dPack.SetColor(color_1.Color.Black);
        return dPack;
    };
    return Cell;
}(Transform));
exports.Cell = Cell;
var CellType;
(function (CellType) {
    CellType[CellType["Empty"] = 0] = "Empty";
    CellType[CellType["Rock"] = 1] = "Rock";
})(CellType = exports.CellType || (exports.CellType = {}));

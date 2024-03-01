"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = void 0;
var world_1 = require("../mainGame/world");
var vector_1 = require("../../shared/vector");
var color_1 = require("../../shared/color");
var playerInput_1 = require("../../shared/enums/playerInput");
var gameObject_1 = require("./gameObject");
var boundingBox_1 = require("./boundingBox");
var unitType_1 = require("../../shared/enums/unitType");
var data_1 = require("../../shared/data");
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    function Transform(pos, size) {
        if (pos === void 0) { pos = new vector_1.Vector(); }
        if (size === void 0) { size = new vector_1.Vector(1, 1); }
        var _this = _super.call(this) || this;
        _this.pos = pos;
        _this.size = size;
        _this.id = -1;
        _this.type = unitType_1.UnitType.None;
        _this.color = color_1.Color.DarkGrey;
        _this.previousPos = new vector_1.Vector();
        return _this;
    }
    Transform.prototype.GetId = function () {
        return this.id;
    };
    Transform.prototype.GetUnitType = function () {
        return this.type;
    };
    Transform.prototype.SetPos = function (pos) {
        this.pos = pos;
    };
    Transform.prototype.SetPosValues = function (x, y) {
        this.pos.x = x;
        this.pos.y = y;
    };
    Transform.prototype.GetPos = function () {
        return this.pos;
    };
    Transform.prototype.AddPos = function (pos) {
        this.pos.add(pos);
    };
    Transform.prototype.SetPreviousPos = function (pos) {
        this.previousPos.x = pos.x;
        this.previousPos.y = pos.y;
    };
    Transform.prototype.AddPreviousPos = function (pos) {
        this.previousPos.add(pos);
    };
    Transform.prototype.GetPreviousPos = function () {
        return this.previousPos;
    };
    Transform.prototype.SetSize = function (size) {
        this.size = size;
    };
    Transform.prototype.SetSizeValues = function (x, y) {
        this.size.x = x;
        this.size.y = y;
    };
    Transform.prototype.GetSize = function () {
        return this.size;
    };
    Transform.prototype.SetColor = function (color) {
        this.color = color;
    };
    Transform.prototype.GetColor = function () {
        return this.color;
    };
    Transform.prototype.GetBoundingBox = function () {
        return boundingBox_1.BoundingBox.MakeFrom(this);
    };
    Transform.prototype.GetOldBoundingBox = function () {
        return boundingBox_1.BoundingBox.MakeFromVectorAndSize(this.GetPreviousPos(), this.GetSize());
    };
    Transform.prototype.GetCombinedBoundingBox = function () {
        return boundingBox_1.BoundingBox.Add(this.GetBoundingBox(), this.GetOldBoundingBox());
    };
    Transform.prototype.GetDataPack = function () {
        var dPack = new data_1.DataPack();
        dPack.SetPos(this.GetTopLeftPos());
        dPack.SetColor(this.GetColor());
        dPack.sx = this.size.x;
        dPack.sy = this.size.y;
        dPack.id = this.GetId();
        dPack.type = this.GetUnitType();
        return dPack;
    };
    Transform.prototype.CheckCollision = function (trans) {
        return (Math.abs(this.pos.x - trans.pos.x) < (this.size.x + trans.size.x) / 2 &&
            Math.abs(this.pos.y - trans.pos.y) < (this.size.y + trans.size.y) / 2);
    };
    Transform.prototype.CheckBBCollision = function (bb) {
        return this.CheckCollision(bb.GetTransform());
    };
    Transform.prototype.GetOverlap = function (trans) {
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
        return new vector_1.Vector(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2);
    };
    Transform.prototype.GetBotRightPos = function () {
        return new vector_1.Vector(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
    };
    Transform.prototype.GetArea = function () {
        return this.size.x * this.size.y;
    };
    Transform.prototype.CheckWorldWrap = function () {
        world_1.World.inst.WorldWrapTransform(this);
    };
    Transform.GetMirrorDir = function (dir) {
        switch (dir) {
            case playerInput_1.DirEnum.Left:
                return playerInput_1.DirEnum.Right;
            case playerInput_1.DirEnum.Right:
                return playerInput_1.DirEnum.Left;
            case playerInput_1.DirEnum.Up:
                return playerInput_1.DirEnum.Down;
            case playerInput_1.DirEnum.Down:
                return playerInput_1.DirEnum.Up;
            case playerInput_1.DirEnum.UpLeft:
                return playerInput_1.DirEnum.DownRight;
            case playerInput_1.DirEnum.UpRight:
                return playerInput_1.DirEnum.DownLeft;
        }
        return playerInput_1.DirEnum.None;
    };
    return Transform;
}(gameObject_1.GameObject));
exports.Transform = Transform;

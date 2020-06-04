"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
var transform_1 = require("../gameObjects/transform");
var vector_1 = require("../gameObjects/vector");
var World = /** @class */ (function () {
    function World(hUnits, vUnits, unitSize) {
        this.hUnits = hUnits;
        this.vUnits = vUnits;
        this.unitSize = unitSize;
        this.rocks = [];
        this.cells = [];
        this.surroundingIndexes = [];
        this.surroundingIndexes.push(0);
        this.surroundingIndexes.push(1);
        this.surroundingIndexes.push(-1);
        this.surroundingIndexes.push(this.hUnits);
        this.surroundingIndexes.push(1 + this.hUnits);
        this.surroundingIndexes.push(-1 + this.hUnits);
        this.surroundingIndexes.push(-this.hUnits);
        this.surroundingIndexes.push(1 - this.hUnits);
        this.surroundingIndexes.push(-1 - this.hUnits);
    }
    World.prototype.GetHorizontalUnits = function () { return this.hUnits; };
    ;
    World.prototype.GetVerticalUnits = function () { return this.vUnits; };
    ;
    World.prototype.GetUnitSize = function () { return this.unitSize; };
    ;
    World.prototype.GetHorizontalSize = function () { return this.hUnits * this.unitSize; };
    ;
    World.prototype.GetVerticalSize = function () { return this.vUnits * this.unitSize; };
    ;
    World.prototype.GetCellCount = function () { return this.hUnits * this.vUnits; };
    ;
    World.prototype.GetXValue = function (i) { return (i % this.hUnits) * this.unitSize; };
    ;
    World.prototype.GetYValue = function (i) { return (Math.floor(i / this.hUnits)) * this.unitSize; };
    ;
    World.prototype.GetIndex = function (pos) {
        var wPos = vector_1.Vector.Wrap(pos, this.GetHorizontalSize(), this.GetVerticalSize());
        return (((Math.floor(wPos.y / this.unitSize)) * this.hUnits) + (Math.floor(wPos.x / this.unitSize)));
    };
    World.prototype.WorldWrap = function (pos) {
        if (pos.x > this.GetHorizontalSize())
            pos.x = 0;
        else if (pos.x < 0)
            pos.x = this.GetHorizontalSize();
        if (pos.y > this.GetVerticalSize())
            pos.y = 0;
        else if (pos.y < 0)
            pos.y = this.GetVerticalSize();
    };
    World.prototype.WorldWrapVector = function (pos) {
        var vec = new vector_1.Vector();
        if (pos.x > this.GetHorizontalSize())
            vec.x = -this.GetHorizontalSize();
        else if (pos.x < 0)
            vec.x = this.GetHorizontalSize();
        if (pos.y > this.GetVerticalSize())
            vec.y = -this.GetVerticalSize();
        else if (pos.y < 0)
            vec.y = this.GetVerticalSize();
        return vec;
    };
    World.prototype.WorldWrapTransform = function (trans) {
        var wrapVec = this.WorldWrapVector(trans.GetPos());
        if (wrapVec.len() > 1) {
            trans.AddPos(wrapVec);
            trans.AddPreviousPos(wrapVec);
        }
    };
    World.prototype.WrapIndex = function (i) {
        if (i < 0)
            return this.GetCellCount() + i;
        else if (i > this.GetCellCount())
            return i - this.GetCellCount();
        return i;
    };
    World.prototype.GetSurroundingCells = function (i) {
        var cells = [];
        for (var _i = 0, _a = this.surroundingIndexes; _i < _a.length; _i++) {
            var cellIndex = _a[_i];
            var cell = this.cells[this.WrapIndex(i + cellIndex)];
            if (cell != undefined)
                cells.push(cell);
        }
        return cells;
    };
    World.prototype.GetPossibleCollisions = function (pos) {
        return this.GetSurroundingCells(this.GetIndex(pos));
    };
    World.prototype.Build = function () {
        var cellsCount = this.GetCellCount();
        for (var i = 0; i < cellsCount; i++) {
            var x = this.GetXValue(i) + (this.unitSize / 2);
            var y = this.GetYValue(i) + (this.unitSize / 2);
            var c = new transform_1.Cell();
            c.SetPos(new vector_1.Vector(x, y));
            c.SetSize(new vector_1.Vector(this.unitSize, this.unitSize));
            if ((Math.random() * 100) > 98) {
                c.cellType = transform_1.CellType.Rock;
                this.rocks.push(c);
            }
            this.cells.push(c);
        }
    };
    World.prototype.GetRocks = function () { return this.rocks; };
    ;
    World.prototype.GenerateDataPack = function () {
        var pack = [];
        for (var _i = 0, _a = this.rocks; _i < _a.length; _i++) {
            var cell = _a[_i];
            pack.push(cell.GetDataPack());
        }
        return pack;
    };
    World.prototype.GetWorldSize = function () {
        return {
            width: World.inst.GetHorizontalSize(),
            height: World.inst.GetVerticalSize(),
            horizontalUnits: World.inst.GetHorizontalUnits(),
            verticalUnits: World.inst.GetVerticalUnits(),
            size: World.inst.GetUnitSize()
        };
    };
    World.inst = new World(60, 40, 30);
    return World;
}());
exports.World = World;

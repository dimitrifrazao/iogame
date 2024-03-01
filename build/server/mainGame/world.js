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
exports.World = exports.CellType = exports.Cell = void 0;
var transform_1 = require("../gameObjects/transform");
var vector_1 = require("../../shared/vector");
var color_1 = require("../../shared/color");
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell(cellType) {
        if (cellType === void 0) { cellType = CellType.Empty; }
        var _this = _super.call(this) || this;
        _this.cellType = CellType.Empty;
        _this.cellType = cellType;
        return _this;
    }
    Cell.prototype.SetCellType = function (cellType) {
        this.cellType = cellType;
    };
    Cell.prototype.GetCellType = function () {
        return this.cellType;
    };
    Cell.prototype.GetDataPack = function () {
        var dPack = _super.prototype.GetDataPack.call(this);
        dPack.SetColor(color_1.Color.Black);
        return dPack;
    };
    return Cell;
}(transform_1.Transform));
exports.Cell = Cell;
var CellType;
(function (CellType) {
    CellType[CellType["Empty"] = 0] = "Empty";
    CellType[CellType["Rock"] = 1] = "Rock";
})(CellType || (exports.CellType = CellType = {}));
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
    /* public static Init(
      hUnits: number = World.defaultH,
      vUnits: number = World.defaultV,
      unitSize: number = World.defaultSize
    ) {
      World.inst = new World(hUnits, vUnits, unitSize);
      World.inst.Build();
    } */
    World.prototype.GetHorizontalUnits = function () {
        return this.hUnits;
    };
    World.prototype.GetVerticalUnits = function () {
        return this.vUnits;
    };
    World.prototype.GetUnitSize = function () {
        return this.unitSize;
    };
    World.prototype.GetHorizontalSize = function () {
        return this.hUnits * this.unitSize;
    };
    World.prototype.GetVerticalSize = function () {
        return this.vUnits * this.unitSize;
    };
    World.prototype.GetCellCount = function () {
        return this.hUnits * this.vUnits;
    };
    World.prototype.GetXValue = function (i) {
        return (i % this.hUnits) * this.unitSize;
    };
    World.prototype.GetYValue = function (i) {
        return Math.floor(i / this.hUnits) * this.unitSize;
    };
    World.prototype.GetIndex = function (pos) {
        var wPos = vector_1.Vector.Wrap(pos, this.GetHorizontalSize(), this.GetVerticalSize());
        return (Math.floor(wPos.y / this.unitSize) * this.hUnits +
            Math.floor(wPos.x / this.unitSize));
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
            var x = this.GetXValue(i) + this.unitSize / 2;
            var y = this.GetYValue(i) + this.unitSize / 2;
            var cell = new Cell();
            cell.SetPos(new vector_1.Vector(x, y));
            cell.SetSize(new vector_1.Vector(this.unitSize, this.unitSize));
            if (Math.random() * 100 > 98) {
                cell.SetCellType(CellType.Rock);
                this.rocks.push(cell);
            }
            this.cells.push(cell);
        }
        console.log("World generated");
    };
    World.prototype.GetRocks = function () {
        return this.rocks;
    };
    World.prototype.GenerateDataPack = function () {
        var pack = [];
        for (var _i = 0, _a = this.rocks; _i < _a.length; _i++) {
            var cell = _a[_i];
            pack.push(cell.GetDataPack());
        }
        return pack;
    };
    World.prototype.GetWorldCenter = function () {
        return new vector_1.Vector(World.inst.GetHorizontalSize() / 2, World.inst.GetVerticalSize() / 2);
    };
    World.prototype.GetWorldSize = function () {
        return new vector_1.Vector(World.inst.GetHorizontalSize(), World.inst.GetVerticalSize());
    };
    World.prototype.GetWorldSizeData = function () {
        return {
            width: World.inst.GetHorizontalSize(),
            height: World.inst.GetVerticalSize(),
            horizontalUnits: World.inst.GetHorizontalUnits(),
            verticalUnits: World.inst.GetVerticalUnits(),
            size: World.inst.GetUnitSize(),
        };
    };
    World.defaultH = 60;
    World.defaultV = 40;
    World.defaultSize = 30;
    return World;
}());
exports.World = World;

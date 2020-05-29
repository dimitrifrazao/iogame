"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellType = exports.Cell = exports.World = void 0;
var transform_1 = require("../gameObjects/transform");
var World = /** @class */ (function () {
    function World(hUnits, vUnits) {
        this.hUnits = hUnits;
        this.vUnits = vUnits;
        this.rocks = [];
    }
    World.prototype.GetHorizontalUnits = function () { return this.hUnits * World.unitSize; };
    ;
    World.prototype.GetVerticalUnits = function () { return this.vUnits * World.unitSize; };
    ;
    World.prototype.GetCellCount = function () { return this.hUnits * this.vUnits; };
    ;
    World.prototype.GetXValue = function (i) { return (i % this.hUnits) * World.unitSize; };
    ;
    World.prototype.GetYValue = function (i) { return (Math.trunc(i / this.vUnits)) * World.unitSize; };
    ;
    World.prototype.Build = function () {
        var cellsCount = this.GetCellCount();
        for (var i = 0; i < cellsCount; i++) {
            var x = this.GetXValue(i);
            var y = this.GetYValue(i);
            if ((Math.random() * 100) > 98) {
                this.rocks.push(new Cell(new transform_1.Vector(x, y), CellType.Rock));
            }
        }
    };
    World.prototype.GenerateDataPack = function () {
        var pack = [];
        for (var _i = 0, _a = this.rocks; _i < _a.length; _i++) {
            var cell = _a[_i];
            pack.push({
                pos: cell.pos,
                color: transform_1.Color.Black,
                sizeX: World.unitSize,
                sizeY: World.unitSize
            });
        }
        return pack;
    };
    World.inst = new World(50, 40);
    World.unitSize = 30;
    return World;
}());
exports.World = World;
var Cell = /** @class */ (function () {
    function Cell(pos, cellType) {
        this.pos = pos;
        this.cellType = cellType;
    }
    ;
    Cell.prototype.IsRock = function () { return this.cellType == CellType.Rock; };
    return Cell;
}());
exports.Cell = Cell;
var CellType;
(function (CellType) {
    CellType[CellType["Empty"] = 0] = "Empty";
    CellType[CellType["Rock"] = 1] = "Rock";
})(CellType = exports.CellType || (exports.CellType = {}));

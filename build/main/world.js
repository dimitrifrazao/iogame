"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
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
    World.prototype.GetIndex = function (pos) {
        return ((Math.trunc(pos.y / World.unitSize)) * this.vUnits) + (Math.trunc(pos.x / World.unitSize));
    };
    World.prototype.GetSurroundingCells = function (i) {
        var cells = [];
        cells.push();
        return cells;
    };
    World.prototype.GetPossibleCollisions = function (pos) {
    };
    World.prototype.Build = function () {
        var cellsCount = this.GetCellCount();
        for (var i = 0; i < cellsCount; i++) {
            var x = this.GetXValue(i) + (World.unitSize / 2);
            var y = this.GetYValue(i) + (World.unitSize / 2);
            if ((Math.random() * 100) > 98) {
                this.rocks.push(new transform_1.Cell(x, y, World.unitSize, transform_1.CellType.Rock));
            }
        }
    };
    World.prototype.GetRocks = function () { return this.rocks; };
    ;
    World.prototype.GenerateDataPack = function () {
        var pack = [];
        for (var _i = 0, _a = this.rocks; _i < _a.length; _i++) {
            var cell = _a[_i];
            pack.push({
                pos: cell.GetTopLeftPos(),
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

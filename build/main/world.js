"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
var transform_1 = require("../gameObjects/transform");
var World = /** @class */ (function () {
    function World(hUnits, vUnits) {
        this.hUnits = hUnits;
        this.vUnits = vUnits;
        this.rocks = [];
        this.deads = [];
        this.cells = [];
    }
    World.prototype.GetHorizontalUnits = function () { return this.hUnits * World.unitSize; };
    ;
    World.prototype.GetVerticalUnits = function () { return this.vUnits * World.unitSize; };
    ;
    World.prototype.GetCellCount = function () { return this.hUnits * this.vUnits; };
    ;
    World.prototype.GetXValue = function (i) { return (i % this.hUnits) * World.unitSize; };
    ;
    World.prototype.GetYValue = function (i) { return (Math.floor(i / this.hUnits)) * World.unitSize; };
    ;
    World.prototype.GetIndex = function (pos) {
        var wPos = transform_1.Vector.Wrap(pos, this.GetHorizontalUnits(), this.GetVerticalUnits());
        return (((Math.floor(wPos.y / World.unitSize)) * this.hUnits) + (Math.floor(wPos.x / World.unitSize)));
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
        cells.push(this.cells[this.WrapIndex(i)]);
        cells.push(this.cells[this.WrapIndex(i + 1)]);
        cells.push(this.cells[this.WrapIndex(i - 1)]);
        cells.push(this.cells[this.WrapIndex(i - this.hUnits)]);
        cells.push(this.cells[this.WrapIndex(i - this.hUnits + 1)]);
        cells.push(this.cells[this.WrapIndex(i - this.hUnits - 1)]);
        cells.push(this.cells[this.WrapIndex(i + this.hUnits)]);
        cells.push(this.cells[this.WrapIndex(i + this.hUnits + 1)]);
        cells.push(this.cells[this.WrapIndex(i + this.hUnits - 1)]);
        return cells;
    };
    World.prototype.GetPossibleCollisions = function (pos) {
        return this.GetSurroundingCells(this.GetIndex(pos));
    };
    World.prototype.Build = function () {
        var cellsCount = this.GetCellCount();
        for (var i = 0; i < cellsCount; i++) {
            var x = this.GetXValue(i) + (World.unitSize / 2);
            var y = this.GetYValue(i) + (World.unitSize / 2);
            var c = new transform_1.Cell();
            c.SetPos(new transform_1.Vector(x, y));
            c.SetSize(new transform_1.Vector(World.unitSize, World.unitSize));
            if ((Math.random() * 100) > 98) {
                c.cellType = transform_1.CellType.Rock;
                this.rocks.push(c);
            }
            this.cells.push(c);
        }
    };
    World.prototype.GetRocks = function () { return this.rocks; };
    ;
    World.prototype.AddDead = function (dead) {
        this.deads.push(dead);
    };
    World.prototype.GenerateDataPack = function () {
        var pack = [];
        for (var _i = 0, _a = this.rocks; _i < _a.length; _i++) {
            var cell = _a[_i];
            pack.push(cell.GetDataPack());
        }
        for (var _b = 0, _c = this.deads; _b < _c.length; _b++) {
            var dead = _c[_b];
            pack.push(dead);
        }
        return pack;
    };
    World.inst = new World(50, 40);
    World.unitSize = 30.0;
    return World;
}());
exports.World = World;

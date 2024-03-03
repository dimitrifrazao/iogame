"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = exports.CellType = exports.Cell = void 0;
const transform_1 = require("../gameObjects/transform");
const vector_1 = require("../../shared/vector");
const data_1 = require("../../shared/data");
const data_2 = require("../../shared/data");
class Cell extends transform_1.Transform {
    constructor(cellType = CellType.Empty) {
        super();
        this.cellType = CellType.Empty;
        this.cellType = cellType;
    }
    SetCellType(cellType) {
        this.cellType = cellType;
    }
    GetCellType() {
        return this.cellType;
    }
    GetWorldIndex() { }
}
exports.Cell = Cell;
var CellType;
(function (CellType) {
    CellType[CellType["Empty"] = 0] = "Empty";
    CellType[CellType["Rock"] = 1] = "Rock";
})(CellType || (exports.CellType = CellType = {}));
class World {
    constructor(hUnits, vUnits, unitSize) {
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
        World.inst = this;
    }
    GetHorizontalUnits() {
        return this.hUnits;
    }
    GetVerticalUnits() {
        return this.vUnits;
    }
    GetUnitSize() {
        return this.unitSize;
    }
    GetHorizontalSize() {
        return this.hUnits * this.unitSize;
    }
    GetVerticalSize() {
        return this.vUnits * this.unitSize;
    }
    GetCellCount() {
        return this.hUnits * this.vUnits;
    }
    GetXValue(i) {
        return (i % this.hUnits) * this.unitSize;
    }
    GetYValue(i) {
        return Math.floor(i / this.hUnits) * this.unitSize;
    }
    GetIndex(pos) {
        let wPos = vector_1.Vector.Wrap(pos, this.GetHorizontalSize(), this.GetVerticalSize());
        return (Math.floor(wPos.y / this.unitSize) * this.hUnits +
            Math.floor(wPos.x / this.unitSize));
    }
    WorldWrap(pos) {
        if (pos.x > this.GetHorizontalSize())
            pos.x = 0;
        else if (pos.x < 0)
            pos.x = this.GetHorizontalSize();
        if (pos.y > this.GetVerticalSize())
            pos.y = 0;
        else if (pos.y < 0)
            pos.y = this.GetVerticalSize();
    }
    WorldWrapVector(pos) {
        let vec = new vector_1.Vector();
        if (pos.x > this.GetHorizontalSize())
            vec.x = -this.GetHorizontalSize();
        else if (pos.x < 0)
            vec.x = this.GetHorizontalSize();
        if (pos.y > this.GetVerticalSize())
            vec.y = -this.GetVerticalSize();
        else if (pos.y < 0)
            vec.y = this.GetVerticalSize();
        return vec;
    }
    WorldWrapTransform(trans) {
        let wrapVec = this.WorldWrapVector(trans.GetPos());
        if (wrapVec.len() > 1) {
            trans.AddPos(wrapVec);
            trans.AddPreviousPos(wrapVec);
        }
    }
    WrapIndex(i) {
        if (i < 0)
            return this.GetCellCount() + i;
        else if (i > this.GetCellCount())
            return i - this.GetCellCount();
        return i;
    }
    GetSurroundingCells(i) {
        let cells = [];
        for (let cellIndex of this.surroundingIndexes) {
            let cell = this.cells[this.WrapIndex(i + cellIndex)];
            if (cell != undefined)
                cells.push(cell);
        }
        return cells;
    }
    GetPossibleCollisions(pos) {
        return this.GetSurroundingCells(this.GetIndex(pos));
    }
    Build() {
        let cellsCount = this.GetCellCount();
        for (let i = 0; i < cellsCount; i++) {
            let x = this.GetXValue(i) + this.unitSize / 2;
            let y = this.GetYValue(i) + this.unitSize / 2;
            let cell = new Cell();
            cell.SetPos(new vector_1.Vector(x, y));
            cell.SetSize(new vector_1.Vector(this.unitSize, this.unitSize));
            if (Math.random() * 100 > 98) {
                cell.SetCellType(CellType.Rock);
                this.rocks.push(cell);
            }
            this.cells.push(cell);
        }
        console.log("World generated");
    }
    GetRocks() {
        return this.rocks;
    }
    GetWorldData() {
        let gd = new data_1.GameData(data_2.GameDataType.WorldData);
        for (let cell of this.rocks) {
            let v = cell.GetPos();
            gd.data.push(v.y);
            gd.data.push(v.x);
        }
        gd.data.push(World.inst.GetHorizontalUnits());
        gd.data.push(World.inst.GetVerticalUnits());
        gd.data.push(World.inst.GetUnitSize());
        return gd;
    }
    GetWorldCenter() {
        return new vector_1.Vector(World.inst.GetHorizontalSize() / 2, World.inst.GetVerticalSize() / 2);
    }
    GetWorldSize() {
        return new vector_1.Vector(World.inst.GetHorizontalSize(), World.inst.GetVerticalSize());
    }
    GetWorldSizeData() {
        return {
            width: World.inst.GetHorizontalSize(),
            height: World.inst.GetVerticalSize(),
            horizontalUnits: World.inst.GetHorizontalUnits(),
            verticalUnits: World.inst.GetVerticalUnits(),
            size: World.inst.GetUnitSize(),
        };
    }
}
exports.World = World;
World.defaultH = 60;
World.defaultV = 40;
World.defaultSize = 30;

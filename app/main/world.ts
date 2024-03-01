import { Transform, DataPack } from "../gameObjects/transform";
import { Vector } from "../gameObjects/vector";
import { Color } from "../gameObjects/color";

export class Cell extends Transform {
  private cellType: CellType = CellType.Empty;
  constructor(cellType: CellType = CellType.Empty) {
    super();
    this.cellType = cellType;
  }
  SetCellType(cellType: CellType) {
    this.cellType = cellType;
  }
  GetCellType() {
    return this.cellType;
  }

  GetDataPack(): DataPack {
    let dPack = super.GetDataPack();
    dPack.SetColor(Color.Black);
    return dPack;
  }
}

export enum CellType {
  Empty = 0,
  Rock = 1,
}

export class World {
  public static inst: World;
  public static defaultH = 60;
  public static defaultV = 40;
  public static defaultSize = 30;
  private rocks: Cell[] = [];
  private cells: Cell[] = [];
  private surroundingIndexes: number[] = [];

  constructor(
    private hUnits: number,
    private vUnits: number,
    private unitSize: number
  ) {
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

  GetXValue(i: number) {
    return (i % this.hUnits) * this.unitSize;
  }
  GetYValue(i: number) {
    return Math.floor(i / this.hUnits) * this.unitSize;
  }
  GetIndex(pos: Vector) {
    let wPos = Vector.Wrap(
      pos,
      this.GetHorizontalSize(),
      this.GetVerticalSize()
    );
    return (
      Math.floor(wPos.y / this.unitSize) * this.hUnits +
      Math.floor(wPos.x / this.unitSize)
    );
  }

  WorldWrap(pos: Vector): void {
    if (pos.x > this.GetHorizontalSize()) pos.x = 0;
    else if (pos.x < 0) pos.x = this.GetHorizontalSize();
    if (pos.y > this.GetVerticalSize()) pos.y = 0;
    else if (pos.y < 0) pos.y = this.GetVerticalSize();
  }

  WorldWrapVector(pos: Vector): Vector {
    let vec = new Vector();
    if (pos.x > this.GetHorizontalSize()) vec.x = -this.GetHorizontalSize();
    else if (pos.x < 0) vec.x = this.GetHorizontalSize();
    if (pos.y > this.GetVerticalSize()) vec.y = -this.GetVerticalSize();
    else if (pos.y < 0) vec.y = this.GetVerticalSize();
    return vec;
  }

  WorldWrapTransform(trans: Transform) {
    let wrapVec = this.WorldWrapVector(trans.GetPos());
    if (wrapVec.len() > 1) {
      trans.AddPos(wrapVec);
      trans.AddPreviousPos(wrapVec);
    }
  }

  WrapIndex(i: number) {
    if (i < 0) return this.GetCellCount() + i;
    else if (i > this.GetCellCount()) return i - this.GetCellCount();
    return i;
  }

  GetSurroundingCells(i: number): Cell[] {
    let cells: Cell[] = [];
    for (let cellIndex of this.surroundingIndexes) {
      let cell = this.cells[this.WrapIndex(i + cellIndex)];
      if (cell != undefined) cells.push(cell);
    }
    return cells;
  }

  GetPossibleCollisions(pos: Vector): Cell[] {
    return this.GetSurroundingCells(this.GetIndex(pos));
  }

  Build() {
    let cellsCount = this.GetCellCount();
    for (let i = 0; i < cellsCount; i++) {
      let x = this.GetXValue(i) + this.unitSize / 2;
      let y = this.GetYValue(i) + this.unitSize / 2;

      let cell = new Cell();
      cell.SetPos(new Vector(x, y));
      cell.SetSize(new Vector(this.unitSize, this.unitSize));

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

  GenerateDataPack(): object[] {
    let pack: object[] = [];
    for (let cell of this.rocks) {
      pack.push(cell.GetDataPack());
    }
    return pack;
  }

  GetWorldCenter(): Vector {
    return new Vector(
      World.inst.GetHorizontalSize() / 2,
      World.inst.GetVerticalSize() / 2
    );
  }

  GetWorldSize(): Vector {
    return new Vector(
      World.inst.GetHorizontalSize(),
      World.inst.GetVerticalSize()
    );
  }

  GetWorldSizeData(): object {
    return {
      width: World.inst.GetHorizontalSize(),
      height: World.inst.GetVerticalSize(),
      horizontalUnits: World.inst.GetHorizontalUnits(),
      verticalUnits: World.inst.GetVerticalUnits(),
      size: World.inst.GetUnitSize(),
    };
  }
}

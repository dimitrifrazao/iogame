import { UnitType } from "./enums/unitType";
import { Vector } from "./vector";
import { Color } from "./color";

export enum DataType {
  GameData = 0,
  DataPack = 1,
}

abstract class Data {
  constructor(public type: DataType) {
    this.type = type;
  }
}

export enum GameDataType {
  WorldData = 0,
  PlayerData = 1,
  GameData = 2,
  FrameRate = 3,
}

export class GameData extends Data {
  public data: any[] = [];
  constructor(public gameDataType: GameDataType) {
    super(DataType.GameData);
  }

  static Cast(obj: any) {
    let gameData = new GameData(obj.gameDataType);
    gameData.data = obj.data;
    return gameData;
  }
}

export class DataPack extends Data {
  x: number = 0;
  y: number = 0;
  r: number = 0;
  g: number = 0;
  b: number = 0;
  a: number = 1;
  sx: number = 0;
  sy: number = 0;
  id: number = 0;
  unitType: UnitType = UnitType.None;
  name: string = "";

  constructor() {
    super(DataType.DataPack);
  }

  GetPos(): Vector {
    return new Vector(this.x, this.y);
  }
  GetSize(): Vector {
    return new Vector(this.sx, this.sy);
  }
  GetColor(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }
  SetPos(pos: Vector) {
    this.x = pos.x;
    this.y = pos.y;
  }
  SetSize(size: Vector) {
    this.sx = size.x;
    this.sy = size.y;
  }
  SetColor(color: Color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
  }
  SetUnitType(unitType: UnitType) {
    this.unitType = unitType;
  }

  static Cast(obj: any): DataPack {
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

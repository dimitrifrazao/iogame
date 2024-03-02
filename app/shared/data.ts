import { UnitType } from "./enums/unitType";
import { Vector } from "./vector";
import { Color } from "./color";

export enum DataType {}

export class DataPack {
  x: number = 0;
  y: number = 0;
  r: number = 0;
  g: number = 0;
  b: number = 0;
  a: number = 1;
  sx: number = 0;
  sy: number = 0;
  id: number = 0;
  type: UnitType = UnitType.None;
  name: string = "";

  constructor() {}

  SetPos(pos: Vector) {
    this.x = pos.x;
    this.y = pos.y;
  }
  GetPos(): Vector {
    return new Vector(this.x, this.y);
  }
  GetSize(): Vector {
    return new Vector(this.sx, this.sy);
  }
  SetColor(color: Color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
  }
  GetColor(): Color {
    return new Color(this.r, this.g, this.b, this.a);
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
    dp.name = obj.name;
    return dp;
  }
}

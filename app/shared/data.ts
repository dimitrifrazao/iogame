import { UnitType } from "./enums/unitType";
import { Vector } from "./vector";
import { Color } from "./color";

export class DataPack {
  x: number = 0;
  y: number = 0;
  r: number = 0;
  g: number = 0;
  b: number = 0;
  a: number = 255;
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
  SetColor(color: Color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
  }
}

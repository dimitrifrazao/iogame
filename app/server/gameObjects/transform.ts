import { World } from "../mainGame/world";
import { Vector } from "../../shared/vector";
import { Color } from "../../shared/color";
import { DirEnum } from "../../shared/enums/playerInput";
import { GameObject } from "./gameObject";
import { BoundingBox } from "../../shared/boundingBox";
import { UnitType } from "../../shared/enums/unitType";
import { DataPack } from "../../shared/data";

export class Transform extends GameObject {
  protected id: number = -1;
  protected unitType: UnitType = UnitType.None;
  protected color: Color = Color.DarkGrey;
  protected previousPos: Vector = new Vector();

  constructor(
    protected pos: Vector = new Vector(),
    protected size: Vector = new Vector(1, 1)
  ) {
    super();
  }

  GetId(): number {
    return this.id;
  }
  GetUnitType(): UnitType {
    return this.unitType;
  }

  SetPos(pos: Vector) {
    this.SetPosValues(pos.x, pos.y);
  }
  SetPosValues(x: number, y: number) {
    this.pos.x = x;
    this.pos.y = y;
  }
  GetPos() {
    return this.pos.Copy();
  }
  AddPos(pos: Vector) {
    this.pos.add(pos);
  }

  SetPreviousPos(pos: Vector) {
    this.previousPos.x = pos.x;
    this.previousPos.y = pos.y;
  }
  AddPreviousPos(pos: Vector) {
    this.previousPos.add(pos);
  }
  GetPreviousPos() {
    return this.previousPos.Copy();
  }

  SetSize(size: Vector) {
    this.SetSizeValues(size.x, size.y);
  }
  SetSizeValues(x: number, y: number) {
    this.size.x = x;
    this.size.y = y;
  }
  GetSize() {
    return this.size.Copy();
  }
  SetColor(color: Color) {
    this.color = color.Copy();
  }
  GetColor() {
    return this.color.Copy();
  }

  GetBoundingBox(): BoundingBox {
    return new BoundingBox(this.GetTopLeftPos(), this.GetBotRightPos());
  }
  GetOldBoundingBox(): BoundingBox {
    return BoundingBox.MakeFromPosAndSize(
      this.GetPreviousPos(),
      this.GetSize()
    );
  }

  GetCombinedBoundingBox(): BoundingBox {
    return BoundingBox.Add(this.GetBoundingBox(), this.GetOldBoundingBox());
  }

  GetDataPack(): DataPack {
    let dPack = new DataPack();
    dPack.SetPos(this.GetTopLeftPos());
    dPack.SetSize(this.GetSize());
    dPack.SetColor(this.GetColor());
    dPack.id = this.GetId();
    dPack.unitType = this.GetUnitType();
    return dPack;
  }
  CheckCollision(trans: Transform): boolean {
    return (
      Math.abs(this.pos.x - trans.pos.x) < (this.size.x + trans.size.x) / 2 &&
      Math.abs(this.pos.y - trans.pos.y) < (this.size.y + trans.size.y) / 2
    );
  }
  CheckBBCollision(bb: BoundingBox): boolean {
    return this.CheckCollision(Transform.MakeFromBoundingBox(bb));
  }

  GetOverlap(trans: Transform): Transform {
    let bb1 = this.GetBoundingBox();
    let bb2 = trans.GetBoundingBox();
    let bb3 = BoundingBox.Sub(bb1, bb2);
    return Transform.MakeFromBoundingBox(bb3);
  }

  ApplyBulletOverlapPush(bulletStretch: Transform, overlap: Transform) {
    if (bulletStretch.size.x > bulletStretch.size.y) {
      this.pos.x -= overlap.size.x;
    } else {
      this.pos.x -= overlap.size.y;
    }
  }

  GetTopLeftPos() {
    return this.pos.newSub(this.size.newScaleBy(0.5));
  }

  GetBotRightPos() {
    return this.pos.newAdd(this.size.newScaleBy(0.5));
  }

  GetArea() {
    return this.size.x * this.size.y;
  }

  CheckWorldWrap(): void {
    World.inst.WorldWrapTransform(this);
  }

  static GetMirrorDir(dir: DirEnum) {
    switch (dir) {
      case DirEnum.Left:
        return DirEnum.Right;
      case DirEnum.Right:
        return DirEnum.Left;
      case DirEnum.Up:
        return DirEnum.Down;
      case DirEnum.Down:
        return DirEnum.Up;
      case DirEnum.UpLeft:
        return DirEnum.DownRight;
      case DirEnum.UpRight:
        return DirEnum.DownLeft;
    }
    return DirEnum.None;
  }

  static MakeFromBoundingBox(bb: BoundingBox) {
    return new Transform(bb.GetCenterPoint(), bb.GetSize());
  }
}

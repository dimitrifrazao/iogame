import { Vector } from "./vector";
import { DataPack } from "./data";

export class BoundingBox {
  // these 2 vectors are in world space
  private topLeft: Vector;
  private botRight: Vector;
  constructor(topLeft = new Vector(0, 0), botRight = new Vector(0, 0)) {
    this.topLeft = topLeft;
    this.botRight = botRight;
    if (topLeft.x > botRight.x || topLeft.y > botRight.y) {
      console.log("ERROR: bounding box topLeft and bottomRight crossing");
      this.topLeft = botRight;
      this.botRight = topLeft;
    }
  }

  GetTopLeft() {
    return this.topLeft;
  }
  GetBotRight() {
    return this.botRight;
  }
  GetSizeX(): number {
    return this.botRight.x - this.topLeft.x;
  }
  GetSizeY(): number {
    return this.botRight.y - this.topLeft.y;
  }
  GetSize(): Vector {
    return new Vector(this.GetSizeX(), this.GetSizeY());
  }

  GetArea(): number {
    return this.GetSizeX() * this.GetSizeY();
  }

  GetCenterPoint(): Vector {
    return this.topLeft.newAdd(
      this.botRight.newSub(this.topLeft).newScaleBy(0.5)
    );
  }

  /* GetDataPack(): DataPack {
    return this.GetTransform().GetDataPack();
  } */

  CheckCollision(bb: BoundingBox): boolean {
    let pos1 = this.GetCenterPoint();
    let pos2 = bb.GetCenterPoint();
    let size1 = this.GetSize();
    let size2 = bb.GetSize();

    return (
      Math.abs(pos1.x - pos2.x) < (size1.x + size2.x) / 2 &&
      Math.abs(pos1.y - pos2.y) < (size1.y + size2.y) / 2
    );
  }

  /* CheckTransformCollision(transform: Transform) {
    return transform.CheckBBCollision(this);
  } */

  CheckVectorCollision(vec: Vector): boolean {
    return (
      vec.x > this.topLeft.x &&
      vec.x < this.botRight.x &&
      vec.y > this.topLeft.y &&
      vec.y < this.botRight.y
    );
  }

  static Add(bb1: BoundingBox, bb2: BoundingBox) {
    let topLeft = new Vector(
      Math.min(bb1.topLeft.x, bb2.topLeft.x),
      Math.min(bb1.topLeft.y, bb2.topLeft.y)
    );
    let botRight = new Vector(
      Math.max(bb1.botRight.x, bb2.botRight.x),
      Math.max(bb1.botRight.y, bb2.botRight.y)
    );
    return new BoundingBox(topLeft, botRight);
  }

  static Sub(bb1: BoundingBox, bb2: BoundingBox): BoundingBox {
    let topLeft = new Vector(
      Math.max(bb1.topLeft.x, bb2.topLeft.x),
      Math.max(bb1.topLeft.y, bb2.topLeft.y)
    );
    let botRight = new Vector(
      Math.min(bb1.botRight.x, bb2.botRight.x),
      Math.min(bb1.botRight.y, bb2.botRight.y)
    );
    return new BoundingBox(topLeft, botRight);
  }

  /* static MakeFrom(trans: Transform): BoundingBox {
    let topLeft = Vector.Copy(trans.GetPos());
    let botRight = Vector.Copy(trans.GetPos());
    topLeft.sub(Vector.ScaleBy(trans.GetSize(), 0.5));
    botRight.add(Vector.ScaleBy(trans.GetSize(), 0.5));
    return new BoundingBox(topLeft, botRight);
  } */

  static MakeFromPosAndSize(pos: Vector, size: Vector): BoundingBox {
    return new BoundingBox(
      pos.newSub(size.newScaleBy(0.5)),
      pos.newAdd(size.newScaleBy(0.5))
    );
  }
}

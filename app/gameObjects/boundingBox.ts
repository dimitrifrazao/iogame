import { Vector } from "./vector";
import { DataPack, Transform } from "./transform";

export class BoundingBox {
  // these 2 vectors are in world space
  private topLeft: Vector;
  private botRight: Vector;
  constructor(topLeft = new Vector(), botRight = new Vector()) {
    this.topLeft = topLeft;
    this.botRight = botRight;
    if (topLeft.x >= botRight.x || topLeft.y >= botRight.y) {
      throw Error("bounding box topLeft and bottomRight crossing");
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

  GetTransform(): Transform {
    let t = new Transform();
    let size = this.botRight.newSub(this.topLeft);
    let center = this.topLeft.newAdd(size.newScaleBy(0.5));
    t.SetPos(center);
    t.SetSize(size);
    return t;
  }

  GetCenterPoint(): Vector {
    return this.GetTransform().GetPos();
  }

  GetDataPack(): DataPack {
    return this.GetTransform().GetDataPack();
  }

  CheckCollision(bb: BoundingBox): boolean {
    let topLeft = bb.GetTopLeft();
    let botRight = bb.GetBotRight();

    let topRight = topLeft.copy();
    let botLeft = botRight.copy();
    topRight.x = botRight.x;
    botLeft.x = topLeft.x;

    if (this.CheckVectorCollision(topLeft)) return true;
    if (this.CheckVectorCollision(botRight)) return true;
    if (this.CheckVectorCollision(topRight)) return true;
    if (this.CheckVectorCollision(botLeft)) return true;
    return false;
  }

  CheckTransformCollision(transform: Transform) {
    return transform.CheckBBCollision(this);
  }

  CheckVectorCollision(vec: Vector) {
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

  static Sub(bb1: BoundingBox, bb2: BoundingBox) {
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

  static MakeFrom(trans: Transform): BoundingBox {
    let topLeft = Vector.Copy(trans.GetPos());
    let botRight = Vector.Copy(trans.GetPos());
    topLeft.sub(Vector.ScaleBy(trans.GetSize(), 0.5));
    botRight.add(Vector.ScaleBy(trans.GetSize(), 0.5));
    return new BoundingBox(topLeft, botRight);
  }

  static MakeFromVectorAndSize(vec: Vector, size: Vector): BoundingBox {
    let topLeft = Vector.Copy(vec);
    let botRight = Vector.Copy(vec);
    topLeft.sub(Vector.ScaleBy(size, 0.5));
    botRight.add(Vector.ScaleBy(size, 0.5));
    return new BoundingBox(topLeft, botRight);
  }
}

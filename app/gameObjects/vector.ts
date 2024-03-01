import { DirEnum } from "./interfaces/imove";

export class Vector {
  constructor(public x: number = 0, public y: number = 0) {}
  add(vec: Vector) {
    this.x += vec.x;
    this.y += vec.y;
  }
  sub(vec: Vector) {
    this.x -= vec.x;
    this.y -= vec.y;
  }
  mul(vec: Vector) {
    this.x *= vec.x;
    this.y *= vec.y;
  }
  newAdd(vec: Vector) {
    let v = new Vector(this.x, this.y);
    v.add(vec);
    return v;
  }
  newSub(vec: Vector) {
    let v = new Vector(this.x, this.y);
    v.sub(vec);
    return v;
  }
  newMul(vec: Vector) {
    let v = new Vector(this.x, this.y);
    v.mul(vec);
    return v;
  }
  newScaleBy(value: number) {
    let v = new Vector(this.x, this.y);
    v.scaleBy(value);
    return v;
  }
  len(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  normal(): Vector {
    return new Vector(this.x / this.len(), this.y / this.len());
  }
  normalize(): void {
    if (this.len() > 0) {
      this.x /= this.len();
      this.y /= this.len();
    }
  }
  scaleBy(scale: number): void {
    this.x *= scale;
    this.y *= scale;
  }
  distaceTo(target: Vector): number {
    return Vector.Sub(target, this).len();
  }
  wrap(x: number, y: number) {
    if (this.x < 0) this.x += x;
    else this.x = this.x % x;
    if (this.y < 0) this.y += y;
    else this.y = this.y % y;
  }

  copy(): Vector {
    return Vector.Copy(this);
  }

  static Up: Vector = new Vector(0, -1);
  static Down: Vector = new Vector(0, 1);
  static Left: Vector = new Vector(-1, 0);
  static Right: Vector = new Vector(1, 0);
  static UpLeft: Vector = new Vector(-1, -1).normal();
  static UpRight: Vector = new Vector(1, -1).normal();
  static DownLeft: Vector = new Vector(-1, 1).normal();
  static DownRight: Vector = new Vector(1, 1).normal();

  static Zero: Vector = new Vector();

  static GetDirVector(dir: DirEnum): Vector {
    switch (dir) {
      case DirEnum.Up:
        return Vector.Up;
      case DirEnum.Down:
        return Vector.Down;
      case DirEnum.Left:
        return Vector.Left;
      case DirEnum.Right:
        return Vector.Right;
      default:
        return new Vector();
    }
  }

  static Copy(vec: Vector) {
    return new Vector(vec.x, vec.y);
  }

  static Add(vec1: Vector, vec2: Vector) {
    return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
  }
  static Sub(vec1: Vector, vec2: Vector) {
    return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
  }

  static ScaleBy(vec: Vector, scale: number) {
    return new Vector(vec.x * scale, vec.y * scale);
  }

  static Wrap(vec: Vector, x: number, y: number): Vector {
    let wrappedVec = Vector.Copy(vec);
    wrappedVec.wrap(x, y);
    return wrappedVec;
  }

  static Lerp(start: Vector, end: Vector, t: number) {
    if (t > 1) t = 1;
    else if (t < 0) t = 0;
    return new Vector(
      start.x * (1 - t) + end.x * t,
      start.y * (1 - t) + end.y * t
    );
  }
}

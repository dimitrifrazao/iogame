"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
const playerInput_1 = require("./enums/playerInput");
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }
    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }
    mul(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
    }
    newAdd(vec) {
        let v = new Vector(this.x, this.y);
        v.add(vec);
        return v;
    }
    newSub(vec) {
        let v = new Vector(this.x, this.y);
        v.sub(vec);
        return v;
    }
    newMul(vec) {
        let v = new Vector(this.x, this.y);
        v.mul(vec);
        return v;
    }
    newScaleBy(value) {
        let v = new Vector(this.x, this.y);
        v.scaleBy(value);
        return v;
    }
    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normal() {
        return new Vector(this.x / this.len(), this.y / this.len());
    }
    normalize() {
        if (this.len() > 0) {
            this.x /= this.len();
            this.y /= this.len();
        }
    }
    scaleBy(scale) {
        this.x *= scale;
        this.y *= scale;
    }
    distaceTo(target) {
        return Vector.Sub(target, this).len();
    }
    wrap(x, y) {
        if (this.x < 0)
            this.x += x;
        else
            this.x = this.x % x;
        if (this.y < 0)
            this.y += y;
        else
            this.y = this.y % y;
    }
    Copy() {
        return Vector.Copy(this);
    }
    static GetDirVector(dir) {
        switch (dir) {
            case playerInput_1.DirEnum.Up:
                return Vector.Up;
            case playerInput_1.DirEnum.Down:
                return Vector.Down;
            case playerInput_1.DirEnum.Left:
                return Vector.Left;
            case playerInput_1.DirEnum.Right:
                return Vector.Right;
            default:
                return new Vector();
        }
    }
    static Copy(vec) {
        return new Vector(vec.x, vec.y);
    }
    static Add(vec1, vec2) {
        return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    }
    static Sub(vec1, vec2) {
        return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
    }
    static ScaleBy(vec, scale) {
        return new Vector(vec.x * scale, vec.y * scale);
    }
    static Wrap(vec, x, y) {
        let wrappedVec = Vector.Copy(vec);
        wrappedVec.wrap(x, y);
        return wrappedVec;
    }
    static Lerp(start, end, t) {
        if (t > 1)
            t = 1;
        else if (t < 0)
            t = 0;
        return new Vector(start.x * (1 - t) + end.x * t, start.y * (1 - t) + end.y * t);
    }
}
exports.Vector = Vector;
Vector.Up = new Vector(0, -1);
Vector.Down = new Vector(0, 1);
Vector.Left = new Vector(-1, 0);
Vector.Right = new Vector(1, 0);
Vector.UpLeft = new Vector(-1, -1).normal();
Vector.UpRight = new Vector(1, -1).normal();
Vector.DownLeft = new Vector(-1, 1).normal();
Vector.DownRight = new Vector(1, 1).normal();
Vector.FlipH = new Vector(-1, 1);
Vector.FlipV = new Vector(1, -1);
Vector.Zero = new Vector();

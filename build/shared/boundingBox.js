"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundingBox = void 0;
const vector_1 = require("./vector");
class BoundingBox {
    constructor(topLeft = new vector_1.Vector(0, 0), botRight = new vector_1.Vector(0, 0)) {
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
    GetSizeX() {
        return this.botRight.x - this.topLeft.x;
    }
    GetSizeY() {
        return this.botRight.y - this.topLeft.y;
    }
    GetSize() {
        return new vector_1.Vector(this.GetSizeX(), this.GetSizeY());
    }
    GetArea() {
        return this.GetSizeX() * this.GetSizeY();
    }
    GetCenterPoint() {
        return this.topLeft.newAdd(this.botRight.newSub(this.topLeft).newScaleBy(0.5));
    }
    /* GetDataPack(): DataPack {
      return this.GetTransform().GetDataPack();
    } */
    CheckCollision(bb) {
        let pos1 = this.GetCenterPoint();
        let pos2 = bb.GetCenterPoint();
        let size1 = this.GetSize();
        let size2 = bb.GetSize();
        return (Math.abs(pos1.x - pos2.x) < (size1.x + size2.x) / 2 &&
            Math.abs(pos1.y - pos2.y) < (size1.y + size2.y) / 2);
    }
    /* CheckTransformCollision(transform: Transform) {
      return transform.CheckBBCollision(this);
    } */
    CheckVectorCollision(vec) {
        return (vec.x > this.topLeft.x &&
            vec.x < this.botRight.x &&
            vec.y > this.topLeft.y &&
            vec.y < this.botRight.y);
    }
    static Add(bb1, bb2) {
        let topLeft = new vector_1.Vector(Math.min(bb1.topLeft.x, bb2.topLeft.x), Math.min(bb1.topLeft.y, bb2.topLeft.y));
        let botRight = new vector_1.Vector(Math.max(bb1.botRight.x, bb2.botRight.x), Math.max(bb1.botRight.y, bb2.botRight.y));
        return new BoundingBox(topLeft, botRight);
    }
    static Sub(bb1, bb2) {
        let topLeft = new vector_1.Vector(Math.max(bb1.topLeft.x, bb2.topLeft.x), Math.max(bb1.topLeft.y, bb2.topLeft.y));
        let botRight = new vector_1.Vector(Math.min(bb1.botRight.x, bb2.botRight.x), Math.min(bb1.botRight.y, bb2.botRight.y));
        return new BoundingBox(topLeft, botRight);
    }
    /* static MakeFrom(trans: Transform): BoundingBox {
      let topLeft = Vector.Copy(trans.GetPos());
      let botRight = Vector.Copy(trans.GetPos());
      topLeft.sub(Vector.ScaleBy(trans.GetSize(), 0.5));
      botRight.add(Vector.ScaleBy(trans.GetSize(), 0.5));
      return new BoundingBox(topLeft, botRight);
    } */
    static MakeFromPosAndSize(pos, size) {
        return new BoundingBox(pos.newSub(size.newScaleBy(0.5)), pos.newAdd(size.newScaleBy(0.5)));
    }
}
exports.BoundingBox = BoundingBox;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundingBox = void 0;
var vector_1 = require("./vector");
var transform_1 = require("./transform");
var BoundingBox = /** @class */ (function () {
    function BoundingBox() {
        this.topLeft = new vector_1.Vector();
        this.botRight = new vector_1.Vector();
    }
    BoundingBox.prototype.GetTopLeft = function () { return this.topLeft; };
    ;
    BoundingBox.prototype.GetBotRight = function () { return this.botRight; };
    ;
    BoundingBox.prototype.GetSizeX = function () { return Math.abs(this.botRight.x - this.topLeft.x); };
    ;
    BoundingBox.prototype.GetSizeY = function () { return Math.abs(this.botRight.y - this.topLeft.y); };
    ;
    BoundingBox.prototype.GetSize = function () { return new vector_1.Vector(this.GetSizeX(), this.GetSizeY()); };
    ;
    BoundingBox.prototype.GetTransform = function () {
        var t = new transform_1.Transform();
        t.SetPos(vector_1.Vector.GetInbetween(this.topLeft, this.botRight));
        t.SetSize(new vector_1.Vector(this.GetSizeX(), this.GetSizeY()));
        return t;
    };
    BoundingBox.prototype.CheckCollision = function (bb) {
        return (Math.abs(this.topLeft.x - bb.botRight.x) < (this.GetSizeX() + bb.GetSizeX())) &&
            (Math.abs(this.topLeft.y - bb.botRight.y) < (this.GetSizeY() + bb.GetSizeY()));
    };
    ;
    BoundingBox.prototype.CheckVectorCollision = function (vec) {
        return (vec.x > this.topLeft.x) && (vec.x < this.botRight.x) &&
            (vec.y > this.topLeft.y) && (vec.y < this.botRight.y);
    };
    BoundingBox.Add = function (bb1, bb2) {
        var bb3 = new BoundingBox();
        bb3.topLeft.x = Math.min(bb1.topLeft.x, bb2.topLeft.x);
        bb3.topLeft.y = Math.min(bb1.topLeft.y, bb2.topLeft.y);
        bb3.botRight.x = Math.max(bb1.botRight.x, bb2.botRight.x);
        bb3.botRight.y = Math.max(bb1.botRight.y, bb2.botRight.y);
        return bb3;
    };
    BoundingBox.Sub = function (bb1, bb2) {
        var bb3 = new BoundingBox();
        bb3.topLeft.x = Math.max(bb1.topLeft.x, bb2.topLeft.x);
        bb3.topLeft.y = Math.max(bb1.topLeft.y, bb2.topLeft.y);
        bb3.botRight.x = Math.min(bb1.botRight.x, bb2.botRight.x);
        bb3.botRight.y = Math.min(bb1.botRight.y, bb2.botRight.y);
        return bb3;
    };
    BoundingBox.MakeFrom = function (trans) {
        var bb = new BoundingBox();
        bb.topLeft = vector_1.Vector.Copy(trans.GetPos());
        bb.botRight = vector_1.Vector.Copy(trans.GetPos());
        bb.topLeft.sub(vector_1.Vector.ScaleBy(trans.GetSize(), 0.5));
        bb.botRight.add(vector_1.Vector.ScaleBy(trans.GetSize(), 0.5));
        return bb;
    };
    BoundingBox.MakeFromVectorAndSize = function (vec, size) {
        var bb = new BoundingBox();
        bb.topLeft = vector_1.Vector.Copy(vec);
        bb.botRight = vector_1.Vector.Copy(vec);
        bb.topLeft.sub(vector_1.Vector.ScaleBy(size, 0.5));
        bb.botRight.add(vector_1.Vector.ScaleBy(size, 0.5));
        return bb;
    };
    return BoundingBox;
}());
exports.BoundingBox = BoundingBox;

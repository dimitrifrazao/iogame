"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundingBox = void 0;
var vector_1 = require("../../shared/vector");
var transform_1 = require("./transform");
var BoundingBox = /** @class */ (function () {
    function BoundingBox(topLeft, botRight) {
        if (topLeft === void 0) { topLeft = new vector_1.Vector(); }
        if (botRight === void 0) { botRight = new vector_1.Vector(); }
        this.topLeft = topLeft;
        this.botRight = botRight;
        if (topLeft.x > botRight.x || topLeft.y > botRight.y) {
            console.log("ERROR: bounding box topLeft and bottomRight crossing");
        }
    }
    BoundingBox.prototype.GetTopLeft = function () {
        return this.topLeft;
    };
    BoundingBox.prototype.GetBotRight = function () {
        return this.botRight;
    };
    BoundingBox.prototype.GetSizeX = function () {
        return this.botRight.x - this.topLeft.x;
    };
    BoundingBox.prototype.GetSizeY = function () {
        return this.botRight.y - this.topLeft.y;
    };
    BoundingBox.prototype.GetSize = function () {
        return new vector_1.Vector(this.GetSizeX(), this.GetSizeY());
    };
    BoundingBox.prototype.GetTransform = function () {
        var t = new transform_1.Transform();
        var size = this.botRight.newSub(this.topLeft);
        var center = this.topLeft.newAdd(size.newScaleBy(0.5));
        t.SetPos(center);
        t.SetSize(size);
        return t;
    };
    BoundingBox.prototype.GetCenterPoint = function () {
        return this.GetTransform().GetPos();
    };
    BoundingBox.prototype.GetDataPack = function () {
        return this.GetTransform().GetDataPack();
    };
    BoundingBox.prototype.CheckCollision = function (bb) {
        var topLeft = bb.GetTopLeft();
        var botRight = bb.GetBotRight();
        var topRight = topLeft.copy();
        var botLeft = botRight.copy();
        topRight.x = botRight.x;
        botLeft.x = topLeft.x;
        if (this.CheckVectorCollision(topLeft))
            return true;
        if (this.CheckVectorCollision(botRight))
            return true;
        if (this.CheckVectorCollision(topRight))
            return true;
        if (this.CheckVectorCollision(botLeft))
            return true;
        return false;
    };
    BoundingBox.prototype.CheckTransformCollision = function (transform) {
        return transform.CheckBBCollision(this);
    };
    BoundingBox.prototype.CheckVectorCollision = function (vec) {
        return (vec.x > this.topLeft.x &&
            vec.x < this.botRight.x &&
            vec.y > this.topLeft.y &&
            vec.y < this.botRight.y);
    };
    BoundingBox.Add = function (bb1, bb2) {
        var topLeft = new vector_1.Vector(Math.min(bb1.topLeft.x, bb2.topLeft.x), Math.min(bb1.topLeft.y, bb2.topLeft.y));
        var botRight = new vector_1.Vector(Math.max(bb1.botRight.x, bb2.botRight.x), Math.max(bb1.botRight.y, bb2.botRight.y));
        return new BoundingBox(topLeft, botRight);
    };
    BoundingBox.Sub = function (bb1, bb2) {
        var topLeft = new vector_1.Vector(Math.max(bb1.topLeft.x, bb2.topLeft.x), Math.max(bb1.topLeft.y, bb2.topLeft.y));
        var botRight = new vector_1.Vector(Math.min(bb1.botRight.x, bb2.botRight.x), Math.min(bb1.botRight.y, bb2.botRight.y));
        return new BoundingBox(topLeft, botRight);
    };
    BoundingBox.MakeFrom = function (trans) {
        var topLeft = vector_1.Vector.Copy(trans.GetPos());
        var botRight = vector_1.Vector.Copy(trans.GetPos());
        topLeft.sub(vector_1.Vector.ScaleBy(trans.GetSize(), 0.5));
        botRight.add(vector_1.Vector.ScaleBy(trans.GetSize(), 0.5));
        return new BoundingBox(topLeft, botRight);
    };
    BoundingBox.MakeFromVectorAndSize = function (vec, size) {
        var topLeft = vector_1.Vector.Copy(vec);
        var botRight = vector_1.Vector.Copy(vec);
        topLeft.sub(vector_1.Vector.ScaleBy(size, 0.5));
        botRight.add(vector_1.Vector.ScaleBy(size, 0.5));
        return new BoundingBox(topLeft, botRight);
    };
    return BoundingBox;
}());
exports.BoundingBox = BoundingBox;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = exports.Vector = exports.Color = exports.convertDirString = exports.DirEnum = void 0;
var DirEnum;
(function (DirEnum) {
    DirEnum[DirEnum["None"] = 0] = "None";
    DirEnum[DirEnum["Up"] = 1] = "Up";
    DirEnum[DirEnum["Down"] = 2] = "Down";
    DirEnum[DirEnum["Left"] = 3] = "Left";
    DirEnum[DirEnum["Right"] = 4] = "Right";
    DirEnum[DirEnum["UpLeft"] = 5] = "UpLeft";
    DirEnum[DirEnum["UpRight"] = 6] = "UpRight";
    DirEnum[DirEnum["DownLeft"] = 7] = "DownLeft";
    DirEnum[DirEnum["DownRight"] = 8] = "DownRight";
})(DirEnum = exports.DirEnum || (exports.DirEnum = {}));
function convertDirString(dir) {
    switch (dir) {
        case "up":
            return DirEnum.Up;
            break;
        case "down":
            return DirEnum.Down;
            break;
        case "left":
            return DirEnum.Left;
            break;
        case "right":
            return DirEnum.Right;
            break;
    }
    return DirEnum.None;
}
exports.convertDirString = convertDirString;
var Color = /** @class */ (function () {
    function Color(r, g, b) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.CreateRandom = function () {
        return new Color(Math.random() * Color.maxValue, Math.random() * Color.maxValue, Math.random() * Color.maxValue);
    };
    ;
    Color.maxValue = 255;
    Color.Black = new Color(0, 0, 0);
    Color.Red = new Color(255, 0, 0);
    return Color;
}());
exports.Color = Color;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector.Add = function (vec1, vec2) {
        return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    };
    Vector.Sub = function (vec1, vec2) {
        return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
    };
    Vector.ScaleBy = function (vec, scale) {
        var newVec = new Vector(vec.x, vec.y);
        newVec.scaleBy(scale);
        return newVec;
    };
    Vector.prototype.add = function (vec) {
        this.x += vec.x;
        this.y += vec.y;
    };
    ;
    Vector.prototype.sub = function (vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    };
    ;
    Vector.prototype.len = function () { return Math.sqrt((this.x * this.x) + (this.y * this.y)); };
    ;
    Vector.prototype.normal = function () { return new Vector(this.x / this.len(), this.y / this.len()); };
    ;
    Vector.prototype.normalize = function () {
        this.x /= this.len();
        this.y /= this.len();
    };
    Vector.prototype.scaleBy = function (scale) {
        this.x *= scale;
        this.y *= scale;
    };
    Vector.prototype.distaceTo = function (target) {
        return Vector.Sub(target, this).len();
    };
    Vector.UpLeft = new Vector(-1, -1).normal();
    Vector.UpRight = new Vector(1, -1).normal();
    Vector.DownLeft = new Vector(-1, 1).normal();
    Vector.DownRight = new Vector(1, 1).normal();
    return Vector;
}());
exports.Vector = Vector;
var Transform = /** @class */ (function () {
    function Transform(x, y, sizeX, sizeY) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (sizeX === void 0) { sizeX = 1; }
        if (sizeY === void 0) { sizeY = 1; }
        this.pos = new Vector(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
    Transform.prototype.CheckCollision = function (trans) {
        return (Math.abs(this.pos.x - trans.pos.x) < (this.sizeX + trans.sizeX) / 2) &&
            (Math.abs(this.pos.y - trans.pos.y) < (this.sizeY + trans.sizeY) / 2);
    };
    ;
    Transform.prototype.GetTopLeftPos = function () {
        return new Vector(this.pos.x - (this.sizeX / 2), this.pos.y - (this.sizeY / 2));
    };
    ;
    return Transform;
}());
exports.Transform = Transform;
/*module.exports = {
    convertDirEnum: convertDirString
};*/ 

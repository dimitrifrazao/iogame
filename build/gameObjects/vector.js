"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var imove_1 = require("./interfaces/imove");
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
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
    Vector.prototype.wrap = function (x, y) {
        if (this.x < 0)
            this.x += x;
        else
            this.x = this.x % x;
        if (this.y < 0)
            this.y += y;
        else
            this.y = this.y % y;
    };
    Vector.GetDirVector = function (dir) {
        switch (dir) {
            case imove_1.DirEnum.Up: return Vector.Up;
            case imove_1.DirEnum.Down: return Vector.Down;
            case imove_1.DirEnum.Left: return Vector.Left;
            case imove_1.DirEnum.Right: return Vector.Right;
            default: return new Vector();
        }
    };
    Vector.Copy = function (vec) { return new Vector(vec.x, vec.y); };
    ;
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
    Vector.Wrap = function (vec, x, y) {
        var wrappedVec = Vector.Copy(vec);
        wrappedVec.wrap(x, y);
        return wrappedVec;
    };
    Vector.GetInbetween = function (pos1, pos2) {
        var pos3 = Vector.Add(pos2, pos1);
        pos3.scaleBy(0.5);
        return pos3;
    };
    Vector.Lerp = function (start, end, t) {
        if (t > 1)
            t = 1;
        else if (t < 0)
            t = 0;
        return new Vector(((start.x * (1 - t)) + (end.x * t)), ((start.y * (1 - t)) + (end.y * t)));
    };
    Vector.Up = new Vector(0, -1);
    Vector.Down = new Vector(0, 1);
    Vector.Left = new Vector(-1, 0);
    Vector.Right = new Vector(1, 0);
    Vector.UpLeft = new Vector(-1, -1).normal();
    Vector.UpRight = new Vector(1, -1).normal();
    Vector.DownLeft = new Vector(-1, 1).normal();
    Vector.DownRight = new Vector(1, 1).normal();
    Vector.Zero = new Vector();
    return Vector;
}());
exports.Vector = Vector;

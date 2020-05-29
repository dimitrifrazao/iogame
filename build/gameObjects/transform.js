"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = exports.Vector = exports.Color = exports.DirEnum = void 0;
var world_1 = require("../main/world");
__exportStar(require("../main/world"), exports);
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
var Color = /** @class */ (function () {
    function Color(r, g, b) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.Random = function () {
        return new Color((Math.random() * 100) + 100, (Math.random() * 100) + 100, (Math.random() * 100) + 100);
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
    Vector.GetDirVector = function (dir) {
        switch (dir) {
            case DirEnum.Up:
                return Vector.Up;
                break;
            case DirEnum.Down:
                return Vector.Down;
                break;
            case DirEnum.Left:
                return Vector.Left;
                break;
            case DirEnum.Right:
                return Vector.Right;
                break;
            default:
                return new Vector();
                break;
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
    Vector.Up = new Vector(0, -1);
    Vector.Down = new Vector(0, 1);
    Vector.Left = new Vector(-1, 0);
    Vector.Right = new Vector(1, 0);
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
    Transform.prototype.CheckWorldWrap = function () {
        if (this.pos.x > world_1.World.inst.GetHorizontalUnits())
            this.pos.x = -this.sizeX;
        if (this.pos.x < -this.sizeX)
            this.pos.x = world_1.World.inst.GetHorizontalUnits();
        if (this.pos.y > world_1.World.inst.GetVerticalUnits())
            this.pos.y = -this.sizeY;
        if (this.pos.y < -this.sizeY)
            this.pos.y = world_1.World.inst.GetVerticalUnits();
    };
    return Transform;
}());
exports.Transform = Transform;

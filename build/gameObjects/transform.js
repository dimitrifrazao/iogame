"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.CellType = exports.Cell = exports.Transform = exports.DataPack = exports.UnitType = exports.Vector = exports.Color = exports.DirEnum = void 0;
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
    function Color(r, g, b, a) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        if (a === void 0) { a = 1; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Color.Random = function () {
        return new Color((Math.random() * 100) + 100, (Math.random() * 100) + 100, (Math.random() * 100) + 100);
    };
    ;
    Color.maxValue = 255;
    Color.Black = new Color(0, 0, 0);
    Color.Red = new Color(255, 0, 0);
    Color.Green = new Color(0, 255, 0);
    Color.Blue = new Color(0, 0, 255);
    Color.Grey = new Color(200, 200, 200);
    Color.DarkGrey = new Color(50, 50, 50);
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
    Vector.Wrap = function (vec, x, y) {
        var wrappedVec = Vector.Copy(vec);
        wrappedVec.wrap(x, y);
        return wrappedVec;
    };
    Vector.GetInbetween = function (pos1, pos2) {
        var pos3 = Vector.Sub(pos2, pos1);
        pos3.scaleBy(0.5);
        pos3.add(pos1);
        return pos3;
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
var UnitType;
(function (UnitType) {
    UnitType[UnitType["None"] = 0] = "None";
    UnitType[UnitType["Player"] = 1] = "Player";
    UnitType[UnitType["Bullet"] = 2] = "Bullet";
})(UnitType = exports.UnitType || (exports.UnitType = {}));
var DataPack = /** @class */ (function () {
    function DataPack() {
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 1;
        this.sx = 0;
        this.sy = 0;
        this.id = 0;
        this.type = UnitType.None;
    }
    DataPack.prototype.SetPos = function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    };
    DataPack.prototype.SetColor = function (color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    };
    return DataPack;
}());
exports.DataPack = DataPack;
var Transform = /** @class */ (function () {
    function Transform() {
        this.id = -1;
        this.type = UnitType.None;
        this.pos = new Vector();
        this.size = new Vector(1, 1);
        this.color = Color.Grey;
    }
    Transform.prototype.GetId = function () { return this.id; };
    ;
    ;
    Transform.prototype.GetUnitType = function () { return this.type; };
    ;
    Transform.prototype.SetPos = function (pos) { this.pos = pos; };
    ;
    Transform.prototype.GetPos = function () { return this.pos; };
    ;
    Transform.prototype.SetSize = function (size) { this.size = size; };
    ;
    Transform.prototype.GetSize = function () { return this.size; };
    ;
    Transform.prototype.SetColor = function (color) { this.color = color; };
    ;
    Transform.prototype.GetColor = function () { return this.color; };
    ;
    Transform.prototype.GetDataPack = function () {
        var dPack = new DataPack();
        dPack.SetPos(this.GetTopLeftPos());
        dPack.SetColor(this.GetColor());
        dPack.sx = this.size.x,
            dPack.sy = this.size.y,
            dPack.id = this.GetId(),
            dPack.type = this.GetUnitType();
        return dPack;
    };
    Transform.prototype.CheckCollision = function (trans) {
        return (Math.abs(this.pos.x - trans.pos.x) < (this.size.x + trans.size.y) / 2) &&
            (Math.abs(this.pos.y - trans.pos.y) < (this.size.y + trans.size.y) / 2);
    };
    ;
    Transform.prototype.GetOverlap = function (trans) {
        var overLapPos = Vector.GetInbetween(this.pos, trans.pos);
        var overlapSize = new Vector();
        overlapSize.x = Math.min(Math.abs(this.GetBotRightPos().x - trans.GetTopLeftPos().x), Math.abs(this.GetTopLeftPos().x - trans.GetBotRightPos().x));
        overlapSize.y = Math.min(Math.abs(this.GetBotRightPos().y - trans.GetTopLeftPos().y), Math.abs(this.GetTopLeftPos().y - trans.GetBotRightPos().y));
        var overlap = new Transform();
        overlap.SetPos(overLapPos);
        overlap.SetSize(overlapSize);
        return overlap;
    };
    Transform.prototype.ApplyOverlapPush = function (overlap) {
        if (overlap.size.x < overlap.size.y) {
            if (overlap.pos.x > this.pos.x) {
                this.pos.x -= overlap.size.x;
            }
            else {
                this.pos.x += overlap.size.x;
            }
        }
        else {
            if (overlap.pos.y > this.pos.y) {
                this.pos.y -= overlap.size.y;
            }
            else {
                this.pos.y += overlap.size.y;
            }
        }
    };
    Transform.prototype.GetTopLeftPos = function () {
        return new Vector(this.pos.x - (this.size.x / 2), this.pos.y - (this.size.y / 2));
    };
    ;
    Transform.prototype.GetBotRightPos = function () {
        return new Vector(this.pos.x + (this.size.x / 2), this.pos.y + (this.size.y / 2));
    };
    Transform.prototype.GetArea = function () {
        return this.size.x * this.size.y;
    };
    Transform.prototype.CheckWorldWrap = function () {
        if (this.pos.x > world_1.World.inst.GetHorizontalUnits())
            this.pos.x = -this.size.x;
        if (this.pos.x < -this.size.x)
            this.pos.x = world_1.World.inst.GetHorizontalUnits();
        if (this.pos.y > world_1.World.inst.GetVerticalUnits())
            this.pos.y = -this.size.y;
        if (this.pos.y < -this.size.y)
            this.pos.y = world_1.World.inst.GetVerticalUnits();
    };
    Transform.GetMirrorDir = function (dir) {
        switch (dir) {
            case DirEnum.Left: return DirEnum.Right;
            case DirEnum.Right: return DirEnum.Left;
            case DirEnum.Up: return DirEnum.Down;
            case DirEnum.Down: return DirEnum.Up;
            case DirEnum.UpLeft: return DirEnum.DownRight;
            case DirEnum.UpRight: return DirEnum.DownLeft;
        }
        return DirEnum.None;
    };
    return Transform;
}());
exports.Transform = Transform;
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell() {
        var _this = _super.call(this) || this;
        _this.cellType = CellType.Empty;
        return _this;
    }
    ;
    Cell.prototype.IsRock = function () { return this.cellType == CellType.Rock; };
    Cell.prototype.GetDataPack = function () {
        var dPack = _super.prototype.GetDataPack.call(this);
        dPack.SetColor(Color.Black);
        return dPack;
    };
    return Cell;
}(Transform));
exports.Cell = Cell;
var CellType;
(function (CellType) {
    CellType[CellType["Empty"] = 0] = "Empty";
    CellType[CellType["Rock"] = 1] = "Rock";
})(CellType = exports.CellType || (exports.CellType = {}));

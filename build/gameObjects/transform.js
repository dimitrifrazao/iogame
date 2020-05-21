"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = exports.DirEnum = void 0;
var DirEnum;
(function (DirEnum) {
    DirEnum[DirEnum["None"] = 0] = "None";
    DirEnum[DirEnum["Up"] = 1] = "Up";
    DirEnum[DirEnum["Down"] = 2] = "Down";
    DirEnum[DirEnum["Left"] = 3] = "Left";
    DirEnum[DirEnum["Right"] = 4] = "Right";
})(DirEnum = exports.DirEnum || (exports.DirEnum = {}));
var Transform = /** @class */ (function () {
    function Transform(x, y, size) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (size === void 0) { size = 1; }
        this.x = x;
        this.y = y;
        this.size = size;
    }
    Transform.prototype.checkCollision = function (trans) {
        return (Math.abs((this.x + (this.size / 2)) - (trans.x + (trans.size / 2))) < (this.size + trans.size) / 2) &&
            (Math.abs((this.y + (this.size / 2)) - (trans.y + (trans.size / 2))) < (this.size + trans.size) / 2);
    };
    return Transform;
}());
exports.Transform = Transform;
/*module.exports = {
    DirEnum: DirEnum,
    Transform: Transform
};
*/ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
var World = /** @class */ (function () {
    function World(hUnits, vUnits) {
        this.hUnits = hUnits;
        this.vUnits = vUnits;
    }
    World.prototype.GetHorizontalUnits = function () { return this.hUnits; };
    ;
    World.prototype.GetVerticalUnits = function () { return this.vUnits; };
    ;
    World.inst = new World(1000, 500);
    return World;
}());
exports.World = World;

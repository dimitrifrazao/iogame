"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIBase = void 0;
var boundingBox_1 = require("../../../shared/boundingBox");
var vector_1 = require("../../../shared/vector");
var color_1 = require("../../../shared/color");
var UIBase = /** @class */ (function (_super) {
    __extends(UIBase, _super);
    function UIBase(tlx, tly, brx, bry) {
        var _this = _super.call(this, new vector_1.Vector(tlx, tly), new vector_1.Vector(brx, bry)) || this;
        _this.color = color_1.Color.Black;
        return _this;
    }
    UIBase.prototype.Render = function (ctx) { };
    UIBase.prototype.Draw = function (ctx) {
        var topLeft = this.GetTopLeft();
        var botRight = this.GetBotRight();
        ctx.fillStyle = this.color.ToString();
        ctx.fillRect(topLeft.x, topLeft.y, botRight.x, botRight.y);
    };
    return UIBase;
}(boundingBox_1.BoundingBox));
exports.UIBase = UIBase;

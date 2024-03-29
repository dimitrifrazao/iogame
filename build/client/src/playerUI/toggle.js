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
exports.ToggleUI = void 0;
var base_1 = require("./base");
var ToggleUI = /** @class */ (function (_super) {
    __extends(ToggleUI, _super);
    function ToggleUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = false;
        return _this;
    }
    ToggleUI.prototype.Toggle = function () {
        this.state !== this.state;
    };
    ToggleUI.prototype.GetState = function () {
        return this.state;
    };
    return ToggleUI;
}(base_1.UIBase));
exports.ToggleUI = ToggleUI;

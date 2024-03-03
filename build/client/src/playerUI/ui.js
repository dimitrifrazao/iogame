"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UI = void 0;
var toggle_1 = require("./toggle");
var UI = /** @class */ (function () {
    function UI() {
        this.elements = [];
        this.elements.push(new toggle_1.ToggleUI(10, 10, 30, 30));
        UI.Inst = this;
    }
    UI.prototype.Draw = function (ctx) {
        this.elements.forEach(function (element) {
            element.Draw(ctx);
        });
    };
    return UI;
}());
exports.UI = UI;

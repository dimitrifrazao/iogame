"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameUI = void 0;
const toggle_1 = require("./toggle");
class GameUI {
    constructor() {
        this.elements = [];
        this.elements.push(new toggle_1.ToggleUI(10, 10, 30, 30));
    }
    Draw(ctx) {
        this.elements.forEach((element) => {
            element.Draw(ctx);
        });
    }
}
exports.GameUI = GameUI;

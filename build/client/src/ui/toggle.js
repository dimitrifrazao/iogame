"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleUI = void 0;
const base_1 = require("./base");
class ToggleUI extends base_1.UIBase {
    constructor() {
        super(...arguments);
        this.state = false;
    }
    Toggle() {
        this.state !== this.state;
    }
    GetState() {
        return this.state;
    }
}
exports.ToggleUI = ToggleUI;

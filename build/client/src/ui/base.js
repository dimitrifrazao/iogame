"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIBase = void 0;
const boundingBox_1 = require("../../../shared/boundingBox");
const vector_1 = require("../../../shared/vector");
const color_1 = require("../../../shared/color");
class UIBase extends boundingBox_1.BoundingBox {
    constructor(tlx, tly, brx, bry) {
        super(new vector_1.Vector(tlx, tly), new vector_1.Vector(brx, bry));
        this.color = color_1.Color.Black;
    }
    Render(ctx) { }
    Draw(ctx) {
        let topLeft = this.GetTopLeft();
        let botRight = this.GetBotRight();
        ctx.fillStyle = this.color.ToString();
        ctx.fillRect(topLeft.x, topLeft.y, botRight.x, botRight.y);
    }
}
exports.UIBase = UIBase;

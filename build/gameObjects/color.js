"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
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
    Color.Lerp = function (start, end, t) {
        if (t > 1)
            t = 1;
        else if (t < 0)
            t = 0;
        return new Color(((start.r * (1 - t)) + (end.r * t)), ((start.g * (1 - t)) + (end.g * t)), ((start.b * (1 - t)) + (end.b * t)), ((start.a * (1 - t)) + (end.a * t)));
    };
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

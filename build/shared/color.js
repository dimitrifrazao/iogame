"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
class Color {
    constructor(r = 0, g = 0, b = 0, a = 1 // alpha goes from 0 to 1
    ) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }
    ScaleBy(scale) {
        this.r *= scale;
        this.g *= scale;
        this.b *= scale;
    }
    static Random() {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }
    // player colors should not use red
    static PlayerRandom() {
        let g = Math.random() * 200;
        let b = 200 - g;
        return new Color(0.0, g, b);
    }
    ToString() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
    static PlayerRandomColor() {
        return Color.HueShift(50, 150, Math.random());
    }
    static HueShift(min = 0, max = 255, x) {
        if (min >= max)
            throw Error("min argument must be smaller than max");
        x = x % 1;
        // im using a clamped reflected absolute function to get the proper rgb value given a shift from 0 to 1
        // its the same function for each channel but with a horizontal shift of 2/6 to the right
        // R: --\__/
        // G: _/--\__
        // B: \__/--
        return new Color(min +
            (Math.max(Math.min(-6 * Math.abs(x - 1 / 6) + 2, 1), 0) +
                Math.max(-6 * Math.abs(x - 7 / 6) + 2, 0)) *
                max, min + Math.max(Math.min(-6 * Math.abs(x - 1 / 2) + 2, 1), 0) * max, min + Math.max(Math.min(-6 * Math.abs(x - 5 / 6) + 2, 1), 0) * max);
    }
    static RandomPlayerColor() {
        return new Color(Math.random() * 100 + 100, Math.random() * 100 + 100, Math.random() * 100 + 100);
    }
    static Lerp(start, end, t) {
        if (t > 1)
            t = 1;
        else if (t < 0)
            t = 0;
        return new Color(start.r * (1 - t) + end.r * t, start.g * (1 - t) + end.g * t, start.b * (1 - t) + end.b * t, start.a * (1 - t) + end.a * t);
    }
}
exports.Color = Color;
Color.maxValue = 255;
Color.Black = new Color(0, 0, 0);
Color.White = new Color(255, 255, 255);
Color.Red = new Color(255, 0, 0);
Color.Green = new Color(0, 255, 0);
Color.Blue = new Color(0, 0, 255);
Color.Orange = new Color(255, 165, 0);
Color.Yellow = new Color(255, 255, 0);
Color.Cyan = new Color(0, 255, 255);
Color.Magenta = new Color(255, 0, 255);
Color.LightGrey = new Color(200, 200, 200);
Color.Grey = new Color(100, 100, 100);
Color.DarkGrey = new Color(50, 50, 50);
Color.EmptyPlayer = new Color(150, 0, 0);

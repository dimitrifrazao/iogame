export class Color {
  static maxValue: number = 255;

  static readonly Black: Color = new Color(0, 0, 0);
  static readonly White: Color = new Color(255, 255, 255);
  static readonly Red: Color = new Color(255, 0, 0);
  static readonly Green: Color = new Color(0, 255, 0);
  static readonly Blue: Color = new Color(0, 0, 255);
  static readonly Orange: Color = new Color(255, 165, 0);
  static readonly Yellow: Color = new Color(255, 255, 0);
  static readonly Cyan: Color = new Color(0, 255, 255);
  static readonly Magenta: Color = new Color(255, 0, 255);
  static readonly LightGrey: Color = new Color(200, 200, 200);
  static readonly Grey: Color = new Color(100, 100, 100);
  static readonly DarkGrey: Color = new Color(50, 50, 50);

  static readonly EmptyPlayer: Color = new Color(150, 0, 0);

  constructor(
    public r: number = 0,
    public g: number = 0,
    public b: number = 0,
    public a: number = 1 // alpha goes from 0 to 1
  ) {}

  Copy(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  ScaleBy(scale: number) {
    this.r *= scale;
    this.g *= scale;
    this.b *= scale;
  }

  static Random() {
    return new Color(
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    );
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

  static HueShift(min: number = 0, max: number = 255, x: number) {
    if (min >= max) throw Error("min argument must be smaller than max");
    x = x % 1;
    // im using a clamped reflected absolute function to get the proper rgb value given a shift from 0 to 1
    // its the same function for each channel but with a horizontal shift of 2/6 to the right
    // R: --\__/
    // G: _/--\__
    // B: \__/--
    return new Color(
      min +
        (Math.max(Math.min(-6 * Math.abs(x - 1 / 6) + 2, 1), 0) +
          Math.max(-6 * Math.abs(x - 7 / 6) + 2, 0)) *
          max,
      min + Math.max(Math.min(-6 * Math.abs(x - 1 / 2) + 2, 1), 0) * max,
      min + Math.max(Math.min(-6 * Math.abs(x - 5 / 6) + 2, 1), 0) * max
    );
  }

  static RandomPlayerColor() {
    return new Color(
      Math.random() * 100 + 100,
      Math.random() * 100 + 100,
      Math.random() * 100 + 100
    );
  }

  static Lerp(start: Color, end: Color, t: number) {
    if (t > 1) t = 1;
    else if (t < 0) t = 0;
    return new Color(
      start.r * (1 - t) + end.r * t,
      start.g * (1 - t) + end.g * t,
      start.b * (1 - t) + end.b * t,
      start.a * (1 - t) + end.a * t
    );
  }
}

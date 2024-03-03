import { BoundingBox } from "../../../shared/boundingBox";
import { Vector } from "../../../shared/vector";
import { Color } from "../../../shared/color";

export class UIBase extends BoundingBox {
  public color: Color = Color.Black;
  constructor(tlx: number, tly: number, brx: number, bry: number) {
    super(new Vector(tlx, tly), new Vector(brx, bry));
  }
  Render(ctx: any) {}

  Draw(ctx: any) {
    let topLeft = this.GetTopLeft();
    let botRight = this.GetBotRight();
    ctx.fillStyle = this.color.ToString();
    ctx.fillRect(topLeft.x, topLeft.y, botRight.x, botRight.y);
  }
}

import { ToggleUI } from "./toggle";
import { UIBase } from "./base";

export class GameUI {
  constructor() {
    this.elements.push(new ToggleUI(10, 10, 30, 30));
  }
  private elements: UIBase[] = [];

  Draw(ctx: any) {
    this.elements.forEach((element) => {
      element.Draw(ctx);
    });
  }
}

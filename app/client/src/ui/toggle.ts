import { UIBase } from "./base";

export class ToggleUI extends UIBase {
  private state: boolean = false;
  Toggle() {
    this.state !== this.state;
  }
  GetState() {
    return this.state;
  }
}

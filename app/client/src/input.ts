import { DirEnum } from "../../shared/enums/playerInput";
import { WeaponType } from "../../shared/enums/weapons";
import { ClientRequestEnum } from "../../shared/enums/clientRequests";

enum KeyCode {
  W = 87,
  A = 65,
  S = 83,
  D = 68,
  Left = 37,
  Right = 39,
  Up = 38,
  Down = 40,
  Space = 32,
  Shift = 16,
  N1 = 49,
  N2 = 50,
  N3 = 51,
  N4 = 52,
  P = 80,
}

export class InputManager {
  static w: boolean = false;
  static a: boolean = false;
  static s: boolean = false;
  static d: boolean = false;

  static space: boolean = false;

  static weaponCounter = 0;

  static socket: any;

  static SetSocket(socket: any) {
    InputManager.socket = socket;
  }

  static EmitPlayerDir() {
    let playerDir: DirEnum = DirEnum.None;
    if (InputManager.w != InputManager.s) {
      if (InputManager.w) {
        if (InputManager.a) {
          playerDir = DirEnum.UpLeft;
        } else if (InputManager.d) {
          playerDir = DirEnum.UpRight;
        } else {
          playerDir = DirEnum.Up;
        }
      } else {
        if (InputManager.a) {
          playerDir = DirEnum.DownLeft;
        } else if (InputManager.d) {
          playerDir = DirEnum.DownRight;
        } else {
          playerDir = DirEnum.Down;
        }
      }
    } else if (InputManager.a != InputManager.d) {
      if (InputManager.a) {
        playerDir = DirEnum.Left;
      } else if (InputManager.d) {
        playerDir = DirEnum.Right;
      }
    }

    InputManager.socket.emit("playerDir", { dir: playerDir });
  }

  static OnKeyDown(keyCode: number) {
    switch (keyCode) {
      case KeyCode.W:
        InputManager.w = true;
        InputManager.EmitPlayerDir();
        break;
      case KeyCode.A:
        InputManager.a = true;
        InputManager.EmitPlayerDir();
        break;
      case KeyCode.S:
        InputManager.s = true;
        InputManager.EmitPlayerDir();
        break;
      case KeyCode.D:
        InputManager.d = true;
        InputManager.EmitPlayerDir();
        break;

      case KeyCode.Up:
        InputManager.socket.emit("shoot", { dir: DirEnum.Up });
        break;
      case KeyCode.Down:
        InputManager.socket.emit("shoot", { dir: DirEnum.Down });
        break;
      case KeyCode.Left:
        InputManager.socket.emit("shoot", { dir: DirEnum.Left });
        break;
      case KeyCode.Right:
        InputManager.socket.emit("shoot", { dir: DirEnum.Right });
        break;

      case KeyCode.N1:
        InputManager.socket.emit("weaponChange", { type: WeaponType.default });
        break;
      case KeyCode.N2:
        InputManager.socket.emit("weaponChange", { type: WeaponType.shotgun });
        break;
      case KeyCode.N3:
        InputManager.socket.emit("weaponChange", { type: WeaponType.drop });
        break;
      case KeyCode.N4:
        InputManager.socket.emit("weaponChange", { type: WeaponType.knife });
        break;

      case KeyCode.Space:
        InputManager.socket.emit("dash", { dash: true });
        break;

      case KeyCode.Shift:
        InputManager.weaponCounter++;
        if (InputManager.weaponCounter > 3) InputManager.weaponCounter = 0;
        InputManager.socket.emit("weaponChange", {
          type: InputManager.weaponCounter,
        });
        break;

      case KeyCode.P:
        InputManager.socket.emit("ClientRequest", {
          type: ClientRequestEnum.debugToggle,
        });
        break;
    }
  }

  static OnKeyUp(keyCode: number) {
    switch (keyCode) {
      case KeyCode.W:
        InputManager.w = false;
        InputManager.EmitPlayerDir();
        break;
      case KeyCode.A:
        InputManager.a = false;
        InputManager.EmitPlayerDir();
        break;
      case KeyCode.S:
        InputManager.s = false;
        InputManager.EmitPlayerDir();
        break;
      case KeyCode.D:
        InputManager.d = false;
        InputManager.EmitPlayerDir();
        break;

      case KeyCode.Space:
        InputManager.socket.emit("dash", { dash: false });
        break;
    }
  }

  static OnKeyPress(keyCode: number) {}
}

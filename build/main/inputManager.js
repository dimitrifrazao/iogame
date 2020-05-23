"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputManager = void 0;
var transform_1 = require("../gameObjects/transform");
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["W"] = 69] = "W";
    KeyCode[KeyCode["A"] = 65] = "A";
    KeyCode[KeyCode["S"] = 83] = "S";
    KeyCode[KeyCode["D"] = 68] = "D";
    KeyCode[KeyCode["Left"] = 37] = "Left";
    KeyCode[KeyCode["Right"] = 39] = "Right";
    KeyCode[KeyCode["Up"] = 38] = "Up";
    KeyCode[KeyCode["Down"] = 40] = "Down";
    KeyCode[KeyCode["Space"] = 32] = "Space";
})(KeyCode || (KeyCode = {}));
var InputManager = /** @class */ (function () {
    function InputManager() {
    }
    InputManager.EmitPlayerDir = function () {
        var playerDir = transform_1.DirEnum.None;
        if (InputManager.w != InputManager.s) {
            if (InputManager.w) {
                if (InputManager.a) {
                    playerDir = transform_1.DirEnum.UpLeft;
                }
                else if (InputManager.d) {
                    playerDir = transform_1.DirEnum.UpRight;
                }
                else {
                    playerDir = transform_1.DirEnum.Up;
                }
            }
            else {
                if (InputManager.a) {
                    playerDir = transform_1.DirEnum.UpLeft;
                }
                else if (InputManager.d) {
                    playerDir = transform_1.DirEnum.UpRight;
                }
                else {
                    playerDir = transform_1.DirEnum.Down;
                }
            }
        }
        else if (InputManager.a != InputManager.d) {
            if (InputManager.a) {
                playerDir = transform_1.DirEnum.Left;
            }
            else if (InputManager.d) {
                playerDir = transform_1.DirEnum.Right;
            }
        }
        InputManager.socket.emit('keyPress', { dir: playerDir });
    };
    InputManager.OnKeyDown = function (keyCode) {
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
                InputManager.up = true;
                break;
            case KeyCode.Down:
                InputManager.down = true;
                break;
            case KeyCode.Left:
                InputManager.left = true;
                break;
            case KeyCode.Right:
                InputManager.right = true;
                break;
            case KeyCode.Space:
                InputManager.space = true;
                break;
        }
    };
    InputManager.OnKeyUp = function (keyCode) {
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
            case KeyCode.Up:
                InputManager.up = false;
                break;
            case KeyCode.Down:
                InputManager.down = false;
                break;
            case KeyCode.Left:
                InputManager.left = false;
                break;
            case KeyCode.Right:
                InputManager.right = false;
                break;
            case KeyCode.Space:
                InputManager.space = false;
                break;
        }
    };
    InputManager.w = false;
    InputManager.a = false;
    InputManager.s = false;
    InputManager.d = false;
    InputManager.up = false;
    InputManager.down = false;
    InputManager.left = false;
    InputManager.right = false;
    InputManager.space = false;
    return InputManager;
}());
exports.InputManager = InputManager;

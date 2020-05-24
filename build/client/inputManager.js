"use strict";
var DirEnum;
(function (DirEnum) {
    DirEnum[DirEnum["None"] = 0] = "None";
    DirEnum[DirEnum["Up"] = 1] = "Up";
    DirEnum[DirEnum["Down"] = 2] = "Down";
    DirEnum[DirEnum["Left"] = 3] = "Left";
    DirEnum[DirEnum["Right"] = 4] = "Right";
    DirEnum[DirEnum["UpLeft"] = 5] = "UpLeft";
    DirEnum[DirEnum["UpRight"] = 6] = "UpRight";
    DirEnum[DirEnum["DownLeft"] = 7] = "DownLeft";
    DirEnum[DirEnum["DownRight"] = 8] = "DownRight";
})(DirEnum || (DirEnum = {}));
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["W"] = 87] = "W";
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
    InputManager.SetSocket = function (socket) {
        InputManager.socket = socket;
    };
    InputManager.EmitPlayerDir = function () {
        var playerDir = DirEnum.None;
        if (InputManager.w != InputManager.s) {
            if (InputManager.w) {
                if (InputManager.a) {
                    playerDir = DirEnum.UpLeft;
                }
                else if (InputManager.d) {
                    playerDir = DirEnum.UpRight;
                }
                else {
                    playerDir = DirEnum.Up;
                }
            }
            else {
                if (InputManager.a) {
                    playerDir = DirEnum.DownLeft;
                }
                else if (InputManager.d) {
                    playerDir = DirEnum.DownRight;
                }
                else {
                    playerDir = DirEnum.Down;
                }
            }
        }
        else if (InputManager.a != InputManager.d) {
            if (InputManager.a) {
                playerDir = DirEnum.Left;
            }
            else if (InputManager.d) {
                playerDir = DirEnum.Right;
            }
        }
        InputManager.socket.emit('playerDir', { dir: playerDir });
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
                InputManager.socket.emit('shoot', { dir: DirEnum.Up });
                break;
            case KeyCode.Down:
                InputManager.socket.emit('shoot', { dir: DirEnum.Down });
                break;
            case KeyCode.Left:
                InputManager.socket.emit('shoot', { dir: DirEnum.Left });
                break;
            case KeyCode.Right:
                InputManager.socket.emit('shoot', { dir: DirEnum.Right });
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
        }
    };
    InputManager.OnKeyPress = function (keyCode) {
    };
    InputManager.w = false;
    InputManager.a = false;
    InputManager.s = false;
    InputManager.d = false;
    InputManager.space = false;
    return InputManager;
}());

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputManager = void 0;
var playerInput_1 = require("../../shared/enums/playerInput");
var weapons_1 = require("../../shared/enums/weapons");
var clientRequests_1 = require("../../shared/enums/clientRequests");
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
    KeyCode[KeyCode["Shift"] = 16] = "Shift";
    KeyCode[KeyCode["N1"] = 49] = "N1";
    KeyCode[KeyCode["N2"] = 50] = "N2";
    KeyCode[KeyCode["N3"] = 51] = "N3";
    KeyCode[KeyCode["N4"] = 52] = "N4";
    KeyCode[KeyCode["P"] = 80] = "P";
})(KeyCode || (KeyCode = {}));
var InputManager = /** @class */ (function () {
    function InputManager() {
    }
    InputManager.SetSocket = function (socket) {
        InputManager.socket = socket;
    };
    InputManager.EmitPlayerDir = function () {
        var playerDir = playerInput_1.DirEnum.None;
        if (InputManager.w != InputManager.s) {
            if (InputManager.w) {
                if (InputManager.a) {
                    playerDir = playerInput_1.DirEnum.UpLeft;
                }
                else if (InputManager.d) {
                    playerDir = playerInput_1.DirEnum.UpRight;
                }
                else {
                    playerDir = playerInput_1.DirEnum.Up;
                }
            }
            else {
                if (InputManager.a) {
                    playerDir = playerInput_1.DirEnum.DownLeft;
                }
                else if (InputManager.d) {
                    playerDir = playerInput_1.DirEnum.DownRight;
                }
                else {
                    playerDir = playerInput_1.DirEnum.Down;
                }
            }
        }
        else if (InputManager.a != InputManager.d) {
            if (InputManager.a) {
                playerDir = playerInput_1.DirEnum.Left;
            }
            else if (InputManager.d) {
                playerDir = playerInput_1.DirEnum.Right;
            }
        }
        InputManager.socket.emit("playerDir", { dir: playerDir });
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
                InputManager.socket.emit("shoot", { dir: playerInput_1.DirEnum.Up });
                break;
            case KeyCode.Down:
                InputManager.socket.emit("shoot", { dir: playerInput_1.DirEnum.Down });
                break;
            case KeyCode.Left:
                InputManager.socket.emit("shoot", { dir: playerInput_1.DirEnum.Left });
                break;
            case KeyCode.Right:
                InputManager.socket.emit("shoot", { dir: playerInput_1.DirEnum.Right });
                break;
            case KeyCode.N1:
                InputManager.socket.emit("weaponChange", { type: weapons_1.WeaponType.default });
                break;
            case KeyCode.N2:
                InputManager.socket.emit("weaponChange", { type: weapons_1.WeaponType.shotgun });
                break;
            case KeyCode.N3:
                InputManager.socket.emit("weaponChange", { type: weapons_1.WeaponType.drop });
                break;
            case KeyCode.N4:
                InputManager.socket.emit("weaponChange", { type: weapons_1.WeaponType.knife });
                break;
            case KeyCode.Space:
                InputManager.socket.emit("dash", { dash: true });
                break;
            case KeyCode.Shift:
                InputManager.weaponCounter++;
                if (InputManager.weaponCounter > 3)
                    InputManager.weaponCounter = 0;
                InputManager.socket.emit("weaponChange", {
                    type: InputManager.weaponCounter,
                });
                break;
            case KeyCode.P:
                InputManager.socket.emit("ClientRequest", {
                    type: clientRequests_1.ClientRequestEnum.debugToggle,
                });
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
            case KeyCode.Space:
                InputManager.socket.emit("dash", { dash: false });
                break;
        }
    };
    InputManager.OnKeyPress = function (keyCode) { };
    InputManager.w = false;
    InputManager.a = false;
    InputManager.s = false;
    InputManager.d = false;
    InputManager.space = false;
    InputManager.weaponCounter = 0;
    return InputManager;
}());
exports.InputManager = InputManager;

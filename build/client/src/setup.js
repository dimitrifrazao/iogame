"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSetUp = void 0;
const renderer_1 = require("./renderer");
const input_1 = require("./input");
function ClientSetUp(canvas, socket) {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var ctx = canvas.getContext("2d");
    // Renderer only receives socket data
    new renderer_1.Renderer();
    // start up data
    socket.on("worldData", function (data) {
        renderer_1.Renderer.SetWorldData(data);
    });
    socket.on("setPlayerId", function (data) {
        renderer_1.Renderer.SetPlayerId(data.id);
    });
    // game updates
    socket.on("update", function (data) {
        renderer_1.Renderer.Render(canvas, ctx, data);
    });
    socket.on("worldAddDeadBody", function (data) {
        renderer_1.Renderer.AddDeadBody(data);
    });
    socket.on("playerData", function (data) {
        renderer_1.Renderer.SetPlayerData(data);
    });
    // InputManager only emits
    input_1.InputManager.SetSocket(socket);
    document.onkeydown = function (event) {
        input_1.InputManager.OnKeyDown(event.keyCode);
    };
    document.onkeyup = function (event) {
        input_1.InputManager.OnKeyUp(event.keyCode);
    };
    document.onkeypress = function (event) {
        input_1.InputManager.OnKeyPress(event.keyCode);
    };
    if (window.performance) {
        if (performance.navigation.type == 1) {
            socket.disconnect();
            window.history.back();
        }
    }
    console.log("client setup done");
}
exports.ClientSetUp = ClientSetUp;

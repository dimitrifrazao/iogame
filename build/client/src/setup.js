"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSetUp = void 0;
var renderer_1 = require("./renderer");
var input_1 = require("./input");
function ClientSetUp(canvas, socket) {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var ctx = canvas.getContext("2d");
    renderer_1.Renderer.id = socket.id;
    socket.on("update", function (data) {
        renderer_1.Renderer.Render(canvas, ctx, data);
    });
    socket.on("worldData", function (data) {
        renderer_1.Renderer.SetWorldData(data);
    });
    socket.on("worldSize", function (data) {
        renderer_1.Renderer.SetWorldSize(data);
    });
    socket.on("worldAddDeadBody", function (data) {
        renderer_1.Renderer.AddDeadBody(data);
    });
    socket.on("cameraPos", function (data) {
        renderer_1.Renderer.SetCameraPos(data.pos);
    });
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

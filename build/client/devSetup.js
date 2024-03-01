"use strict";
function DevSetUp(canvas, socket, Renderer, InputManager) {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var ctx = canvas.getContext("2d");
    socket.on("update", function (data) {
        Renderer.Render(canvas, ctx, data);
    });
    socket.on("worldData", function (data) {
        Renderer.SetWorldData(data);
    });
    socket.on("worldSize", function (data) {
        data.size = 0.5;
        Renderer.SetWorldSize(data);
        Renderer.SetCameraPos({ x: 0, y: 0 });
    });
    socket.on("worldAddDeadBody", function (data) {
        Renderer.AddDeadBody(data);
    });
    socket.on("setPlayerId", function (data) {
        Renderer.SetPlayerId(data);
    });
    /* socket.on("cameraPos", function (data: any) {
      Renderer.SetCameraPos(data.pos);
    }); */
    InputManager.SetSocket(socket);
    document.onkeydown = function (event) {
        InputManager.OnKeyDown(event.keyCode);
    };
    document.onkeyup = function (event) {
        InputManager.OnKeyUp(event.keyCode);
    };
    document.onkeypress = function (event) {
        InputManager.OnKeyPress(event.keyCode);
    };
    if (window.performance) {
        if (performance.navigation.type == 1) {
            socket.disconnect();
            window.history.back();
        }
    }
    console.log("client setup done");
}

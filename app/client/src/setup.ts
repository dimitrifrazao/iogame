import { Renderer } from "./renderer";
import { InputManager } from "./input";
import { DataPack } from "../../shared/data";

export function ClientSetUp(canvas: any, socket: any) {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  var ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

  // Renderer only receives socket data
  new Renderer();
  // start up data
  socket.on("worldData", function (data: any) {
    Renderer.SetWorldData(data);
  });
  socket.on("setPlayerId", function (data: any) {
    Renderer.SetPlayerId(data.id);
  });

  // game updates
  socket.on("update", function (data: any) {
    Renderer.Render(canvas, ctx, data);
  });
  socket.on("worldAddDeadBody", function (data: any) {
    Renderer.AddDeadBody(data);
  });
  socket.on("playerData", function (data: any) {
    Renderer.SetPlayerData(data);
  });

  // InputManager only emits
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

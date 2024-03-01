//import { DataPack } from "../gameObjects/transform";

class Renderer {
  static gridColor: string = "rgba(0,0,255,0.1)"; // transparent blue
  static worldData: any[] = [];
  static deadBodies = new Map<string, any>();
  //static inst:Renderer = new Renderer();
  static id: number = -1;
  static cameraPos: any;
  static worldWidth: number;
  static worldHeight: number;
  static worldUnitSize: number;
  static worldHorizontalUnits: number;
  static worldVerticalUnits: number;
  constructor() {}

  static SetPlayerId(data: any) {
    Renderer.id = data.id;
    //console.log(" id set to " + Renderer.id );
  }

  static SetCameraPos(pos: any) {
    Renderer.cameraPos = pos;
  }

  static SetWorldData(data: any) {
    console.log("set world data");
    Renderer.worldData = data;
  }

  static SetWorldSize(data: any) {
    Renderer.worldWidth = data.width;
    Renderer.worldHeight = data.height;
    Renderer.worldHorizontalUnits = data.horizontalUnits;
    Renderer.worldVerticalUnits = data.verticalUnits;
    Renderer.worldUnitSize = data.size;
  }

  static AddDeadBody(data: any) {
    Renderer.deadBodies.set(data.id.toString(), data);
  }

  static Render(canvas: any, ctx: any, data: any) {
    let dt = data.pop().dt;

    let topLeftX = canvas.width / 2 - Renderer.cameraPos.x;
    let topLeftY = canvas.height / 2 - Renderer.cameraPos.y;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    ctx.beginPath(); // draw grid

    for (var x = 1; x <= Renderer.worldHorizontalUnits; x++) {
      let finalX = topLeftX + x * Renderer.worldUnitSize;
      ctx.moveTo(finalX, topLeftY);
      ctx.lineTo(finalX, topLeftY + Renderer.worldHeight);
    }

    for (var y = 1; y <= Renderer.worldVerticalUnits; y++) {
      let finalY = topLeftY + y * Renderer.worldUnitSize;
      ctx.moveTo(topLeftX, finalY);
      ctx.lineTo(topLeftX + Renderer.worldWidth, finalY);
    }

    ctx.strokeStyle = Renderer.gridColor;
    ctx.stroke();

    ctx.beginPath(); // draw boarders

    ctx.moveTo(topLeftX, topLeftY);
    ctx.lineTo(topLeftX, topLeftY + Renderer.worldHeight);
    ctx.moveTo(topLeftX + Renderer.worldWidth, topLeftY);
    ctx.lineTo(topLeftX + Renderer.worldWidth, topLeftY + Renderer.worldHeight);

    ctx.moveTo(topLeftX, topLeftY);
    ctx.lineTo(topLeftX + Renderer.worldWidth, topLeftY);
    ctx.moveTo(topLeftX, topLeftY + Renderer.worldHeight);
    ctx.lineTo(topLeftX + Renderer.worldWidth, topLeftY + Renderer.worldHeight);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.stroke();

    ctx.beginPath();
    Renderer.worldData.forEach((dataPack) => {
      let finalX = canvas.width / 2 + dataPack.x - Renderer.cameraPos.x;
      let finalY = canvas.height / 2 + dataPack.y - Renderer.cameraPos.y;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(finalX, finalY, dataPack.sx, dataPack.sy);
    });

    ctx.beginPath();
    let toRemoveWorldData: string[] = [];
    Renderer.deadBodies.forEach((dataPack, id) => {
      dataPack.a -= 0.01;
      if (dataPack.a <= 0) toRemoveWorldData.push(id);

      let finalX = canvas.width / 2 + dataPack.x - Renderer.cameraPos.x;
      let finalY = canvas.height / 2 + dataPack.y - Renderer.cameraPos.y;

      let rgbText =
        "rgba(" +
        dataPack.r +
        "," +
        dataPack.g +
        "," +
        dataPack.b +
        "," +
        dataPack.a +
        ")";
      ctx.fillStyle = rgbText;
      ctx.fillRect(finalX, finalY, dataPack.sx, dataPack.sy);
    });

    for (let id of toRemoveWorldData) {
      Renderer.deadBodies.delete(id);
    }

    for (var i = 0; i < data.length; i++) {
      let d = data[i];
      let rgbText = "rgba(" + d.r + "," + d.g + "," + d.b + "," + d.a + ")";

      switch (d.type) {
        case 0: // debug
          d.x += canvas.width / 2 - Renderer.cameraPos.x;
          d.y += canvas.height / 2 - Renderer.cameraPos.y;
          ctx.fillStyle = rgbText;
          ctx.fillRect(d.x, d.y, d.sx, d.sy);
          break;

        case 1: // players
          if (d.id == Renderer.id) {
            // our player
            let offset = (d.sx - d.sy) / 2;
            d.x = canvas.width / 2 - d.sx / 2;
            d.y = canvas.height / 2 - d.sy / 2 + offset;
          } else {
            // other players
            d.x += canvas.width / 2 - Renderer.cameraPos.x;
            d.y += canvas.height / 2 - Renderer.cameraPos.y;
          }
          ctx.fillStyle = rgbText;
          ctx.fillRect(d.x, d.y, d.sx, d.sy);

          if (d.name !== "") {
            ctx.fillStyle = "rgb(100,100,100)";
            ctx.font = "15px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(d.name, d.x + d.sx / 2, d.y - 5);
          }
          break;

        case 2: // bullets
          d.x += canvas.width / 2 - Renderer.cameraPos.x;
          d.y += canvas.height / 2 - Renderer.cameraPos.y;
          if (d.id == Renderer.id) {
            // player bullet
            rgbText = "rgb(250,0,0)";
          }
          ctx.fillStyle = rgbText;
          ctx.fillRect(d.x, d.y, d.sx, d.sy);
          break;

        case 3: //UI
          if (d.id != Renderer.id) rgbText = "rgba(0,0,0,0)";
          ctx.fillStyle = rgbText;
          ctx.fillRect(d.x, d.y, d.sx, d.sy);
          break;

        case 4: // QuadTreeNode
          d.x += canvas.width / 2 - Renderer.cameraPos.x;
          d.y += canvas.height / 2 - Renderer.cameraPos.y;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y); // left top
          ctx.lineTo(d.x + d.sx, d.y); // right top
          ctx.lineTo(d.x + d.sx, d.y + d.sy); // right bot
          ctx.lineTo(d.x, d.y + d.sy); // left bot
          ctx.lineTo(d.x, d.y); // left top

          /* ctx.moveTo(d.x - d.sx / 2, d.y - d.sy / 2); // left top
          ctx.lineTo(d.x + d.sx / 2, d.y - d.sy / 2); // right top
          ctx.lineTo(d.x + d.sx / 2, d.y + d.sy / 2); // right bot
          ctx.lineTo(d.x - d.sx / 2, d.y + d.sy / 2); // left bot
          ctx.lineTo(d.x - d.sx / 2, d.y - d.sy / 2); // left top */
          ctx.closePath(); // Close the path to connect the last point with the first
          ctx.lineWidth = 2;
          ctx.strokeStyle = "rgb(0,250,0)";
          ctx.stroke();
          break;
      }
    }

    // FPS draw
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    var x = canvas.width * 0.95;
    var y = canvas.height * 0.05;
    ctx.fillText(dt.toString(), x, y);
  }
}

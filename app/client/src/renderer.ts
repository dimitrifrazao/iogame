import { Color } from "../../shared/color";
import { DataPack } from "../../shared/data";
import { UnitType } from "../../shared/enums/unitType";
import { Vector } from "../../shared/vector";

export class Renderer {
  static gridColor: string = "rgba(0,0,255,0.1)"; // transparent blue
  static worldData: any[] = [];
  static deadBodies = new Map<number, any>();
  //static inst:Renderer = new Renderer();
  static id: number;
  static cameraPos: any;
  static worldWidth: number;
  static worldHeight: number;
  static worldUnitSize: number;
  static worldHorizontalUnits: number;
  static worldVerticalUnits: number;
  static topLeftPos: Vector;
  constructor() {}

  static SetPlayerId(id: number) {
    Renderer.id = id;
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
    Renderer.deadBodies.set(data.id, data);
  }

  static GetTopLeftVector() {
    return Renderer.topLeftPos;
  }

  static DrawSquare(ctx: any, data: DataPack, worldSpace: boolean = true) {
    let pos = data.GetPos();
    if (worldSpace) {
      pos.add(Renderer.GetTopLeftVector());
    }
    ctx.fillStyle = data.GetColor().ToString();
    ctx.fillRect(pos.x, pos.y, data.sx, data.sy);
  }

  static DrawSquareLine(ctx: any, data: DataPack, worldSpace: boolean = true) {
    let pos = data.GetPos();
    if (worldSpace) {
      pos.add(Renderer.GetTopLeftVector());
    }
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y); // left top
    ctx.lineTo(pos.x + data.sx, pos.y); // right top
    ctx.lineTo(pos.x + data.sx, pos.y + data.sy); // right bot
    ctx.lineTo(pos.x, pos.y + data.sy); // left bot
    ctx.lineTo(pos.x, pos.y); // left top
    ctx.closePath(); // Close the path to connect the last point with the first
    ctx.lineWidth = 2;
    ctx.strokeStyle = data.GetColor().ToString();
    ctx.stroke();
  }

  static DrawText(
    ctx: any,
    data: DataPack,
    size: number,
    worldSpace: boolean = true
  ) {
    let pos = data.GetPos();
    if (worldSpace) {
      pos.add(Renderer.GetTopLeftVector());
    }
    ctx.fillStyle = data.GetColor().ToString();
    ctx.font = size.toString() + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data.name, pos.x, pos.y);
  }

  static Render(canvas: HTMLCanvasElement, ctx: any, serverData: any) {
    let dt = 0; //serverData.pop().dt;

    let topLeftX = canvas.width / 2 - Renderer.cameraPos.x;
    let topLeftY = canvas.height / 2 - Renderer.cameraPos.y;
    Renderer.topLeftPos = new Vector(topLeftX, topLeftY);

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
    ctx.strokeStyle = Color.Black.ToString();
    ctx.stroke();

    // draw rocks
    Renderer.worldData.forEach((data) => {
      let dataPack = DataPack.Cast(data);
      Renderer.DrawSquare(ctx, dataPack);
    });

    let toRemoveWorldData: number[] = [];
    Renderer.deadBodies.forEach((data, id) => {
      data.a -= 0.01;
      if (data.a <= 0) toRemoveWorldData.push(id);
      else Renderer.DrawSquare(ctx, DataPack.Cast(data));
    });
    if (toRemoveWorldData.length > 0) {
      console.log("deleting dead bodies");
    }
    for (let id of toRemoveWorldData) {
      Renderer.deadBodies.delete(id);
    }

    for (var i = 0; i < serverData.length; i++) {
      let data = DataPack.Cast(serverData[i]);
      let rgbText = data.GetColor().ToString();

      switch (data.type) {
        case UnitType.None: // debug
          Renderer.DrawSquare(ctx, data);
          break;

        case UnitType.Player:
          if (data.id == Renderer.id) {
            // our player
            data.x = canvas.width / 2 - data.sx / 2;
            data.y = canvas.height / 2 - data.sy / 2;
            data.y += (data.sx - data.sy) / 2;
            Renderer.DrawSquare(ctx, data, false);
          } else {
            // other players
            Renderer.DrawSquare(ctx, data);
            data.x += data.sx / 2;
            data.y -= 5;
            Renderer.DrawText(ctx, data, 15);
          }
          break;

        case UnitType.Bullet:
          if (data.id == Renderer.id) data.SetColor(Color.Red);
          Renderer.DrawSquare(ctx, data);
          break;

        case UnitType.UI:
          if (data.id != Renderer.id) continue;
          ctx.fillStyle = rgbText;
          ctx.fillRect(data.x, data.y, data.sx, data.sy);
          break;

        case UnitType.QuadTree: // QuadTreeNode
          Renderer.DrawSquareLine(ctx, data);
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
    ctx.fillText("FR: " + dt.toString(), x, y);
  }
}

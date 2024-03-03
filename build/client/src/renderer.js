"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const color_1 = require("../../shared/color");
const data_1 = require("../../shared/data");
const unitType_1 = require("../../shared/enums/unitType");
const vector_1 = require("../../shared/vector");
const gameUI_1 = require("./ui/gameUI");
const data_2 = require("../../shared/data");
class Renderer {
    constructor() {
        this.gameUI = new gameUI_1.GameUI();
        Renderer.Inst = this;
    }
    static SetPlayerId(id) {
        Renderer.id = id;
    }
    static SetPlayerData(data) {
        if (data.data.length >= 2) {
            Renderer.cameraPos.x = data.data.pop();
            Renderer.cameraPos.y = data.data.pop();
        }
    }
    static SetWorldData(gameData) {
        console.log("set world data");
        Renderer.worldUnitSize = gameData.data.pop();
        Renderer.worldVerticalUnits = gameData.data.pop();
        Renderer.worldHorizontalUnits = gameData.data.pop();
        Renderer.worldWidth =
            Renderer.worldHorizontalUnits * Renderer.worldUnitSize;
        Renderer.worldHeight = Renderer.worldVerticalUnits * Renderer.worldUnitSize;
        while (gameData.data.length > 0) {
            let v = new vector_1.Vector(gameData.data.pop(), gameData.data.pop());
            Renderer.worldData.push(v);
        }
    }
    static SetWorldSize(data) {
        Renderer.worldWidth = data.width;
        Renderer.worldHeight = data.height;
        Renderer.worldHorizontalUnits = data.horizontalUnits;
        Renderer.worldVerticalUnits = data.verticalUnits;
        Renderer.worldUnitSize = data.size;
    }
    static AddDeadBody(data) {
        Renderer.deadBodies.set(data.id, data);
    }
    static GetTopLeftVector() {
        return Renderer.topLeftPos;
    }
    static DrawSquare(ctx, data, worldSpace = true) {
        let pos = data.GetPos();
        if (worldSpace) {
            pos.add(Renderer.GetTopLeftVector());
        }
        ctx.fillStyle = data.GetColor().ToString();
        ctx.fillRect(pos.x, pos.y, data.sx, data.sy);
    }
    static DrawSquareLine(ctx, data, worldSpace = true) {
        let pos = data.GetPos();
        if (worldSpace) {
            pos.add(Renderer.GetTopLeftVector());
        }
        ctx.strokeStyle = data.GetColor().ToString();
        ctx.strokeRect(pos.x, pos.y, data.sx, data.sy);
    }
    static DrawText(ctx, data, textSize, worldSpace = true) {
        let pos = data.GetPos();
        if (worldSpace) {
            pos.add(Renderer.GetTopLeftVector());
        }
        ctx.fillStyle = data.GetColor().ToString();
        ctx.font = textSize.toString() + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data.name, pos.x, pos.y);
    }
    static Render(canvas, ctx, serverData) {
        let dt = 0; //serverData.pop().dt;
        let topLeftX = canvas.width / 2 - Renderer.cameraPos.x;
        let topLeftY = canvas.height / 2 - Renderer.cameraPos.y;
        Renderer.topLeftPos = new vector_1.Vector(topLeftX, topLeftY);
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
        ctx.strokeStyle = color_1.Color.Black.ToString();
        ctx.stroke();
        // draw rocks
        Renderer.worldData.forEach((vector) => {
            let pos = vector.newAdd(Renderer.GetTopLeftVector());
            let units = Renderer.worldUnitSize;
            pos.x -= units / 2;
            pos.y -= units / 2;
            ctx.fillStyle = color_1.Color.Black.ToString();
            ctx.fillRect(pos.x, pos.y, units, units);
        });
        let toRemoveWorldData = [];
        Renderer.deadBodies.forEach((data, id) => {
            data.a -= 0.01;
            if (data.a <= 0)
                toRemoveWorldData.push(id);
            else
                Renderer.DrawSquare(ctx, data_1.DataPack.Cast(data));
        });
        if (toRemoveWorldData.length > 0) {
            console.log("deleting dead bodies");
        }
        for (let id of toRemoveWorldData) {
            Renderer.deadBodies.delete(id);
        }
        for (var i = 0; i < serverData.length; i++) {
            let d = serverData[i];
            if (d.type === data_1.DataType.DataPack) {
                let data = data_1.DataPack.Cast(d);
                switch (data.unitType) {
                    case unitType_1.UnitType.None: // debug
                        data.SetColor(color_1.Color.Magenta);
                        Renderer.DrawSquare(ctx, data);
                        break;
                    case unitType_1.UnitType.Player:
                        if (data.id === Renderer.id) {
                            // our player
                            data.x = canvas.width / 2 - data.sx / 2;
                            data.y = canvas.height / 2 - data.sy / 2;
                            data.y += (data.sx - data.sy) / 2;
                            Renderer.DrawSquare(ctx, data, false);
                            let color = data.GetColor();
                            color.ScaleBy(0.4);
                            data.SetColor(color);
                            Renderer.DrawSquareLine(ctx, data, false);
                        }
                        else {
                            // other players
                            Renderer.DrawSquare(ctx, data);
                            let color = data.GetColor();
                            color.ScaleBy(0.4);
                            data.SetColor(color);
                            Renderer.DrawSquareLine(ctx, data);
                            data.x += data.sx / 2;
                            data.y -= 10;
                            data.SetColor(color_1.Color.Black);
                            Renderer.DrawText(ctx, data, 15);
                        }
                        break;
                    case unitType_1.UnitType.Bullet:
                        if (data.id == Renderer.id)
                            data.SetColor(color_1.Color.Red);
                        Renderer.DrawSquare(ctx, data);
                        let color = data.GetColor();
                        color.ScaleBy(0.4);
                        data.SetColor(color);
                        Renderer.DrawSquareLine(ctx, data);
                        break;
                    case unitType_1.UnitType.UI:
                        if (data.id != Renderer.id)
                            continue;
                        ctx.fillStyle = data.GetColor().ToString();
                        ctx.fillRect(data.x, data.y, data.sx, data.sy);
                        break;
                    case unitType_1.UnitType.QuadTree: // QuadTreeNode
                        Renderer.DrawSquareLine(ctx, data);
                        break;
                }
            }
            else if (d.type === data_1.DataType.GameData) {
                let data = data_2.GameData.Cast(d);
                switch (data.gameDataType) {
                    case data_1.GameDataType.FrameRate:
                        let dt = data.data.pop();
                        ctx.font = "15px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = "black";
                        var x = canvas.width * 0.95;
                        var y = canvas.height * 0.05;
                        ctx.fillText("FR: " + dt.toString(), x, y);
                        break;
                }
            }
        }
        // draw UI
        //Renderer.Inst.gameUI.Draw(ctx);
    }
}
exports.Renderer = Renderer;
Renderer.gridColor = "rgba(0,0,255,0.1)"; // transparent blue
Renderer.worldData = [];
Renderer.deadBodies = new Map();
Renderer.id = -1;
Renderer.cameraPos = new vector_1.Vector();

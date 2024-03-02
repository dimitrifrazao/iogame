"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
var color_1 = require("../../shared/color");
var data_1 = require("../../shared/data");
var unitType_1 = require("../../shared/enums/unitType");
var vector_1 = require("../../shared/vector");
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    Renderer.SetPlayerId = function (id) {
        Renderer.id = id;
    };
    Renderer.SetCameraPos = function (pos) {
        Renderer.cameraPos = pos;
    };
    Renderer.SetWorldData = function (data) {
        console.log("set world data");
        Renderer.worldData = data;
    };
    Renderer.SetWorldSize = function (data) {
        Renderer.worldWidth = data.width;
        Renderer.worldHeight = data.height;
        Renderer.worldHorizontalUnits = data.horizontalUnits;
        Renderer.worldVerticalUnits = data.verticalUnits;
        Renderer.worldUnitSize = data.size;
    };
    Renderer.AddDeadBody = function (data) {
        Renderer.deadBodies.set(data.id, data);
    };
    Renderer.GetTopLeftVector = function () {
        return Renderer.topLeftPos;
    };
    Renderer.DrawSquare = function (ctx, data, worldSpace) {
        if (worldSpace === void 0) { worldSpace = true; }
        var pos = data.GetPos();
        if (worldSpace) {
            pos.add(Renderer.GetTopLeftVector());
        }
        ctx.fillStyle = data.GetColor().ToString();
        ctx.fillRect(pos.x, pos.y, data.sx, data.sy);
    };
    Renderer.DrawSquareLine = function (ctx, data, worldSpace) {
        if (worldSpace === void 0) { worldSpace = true; }
        var pos = data.GetPos();
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
    };
    Renderer.DrawText = function (ctx, data, size, worldSpace) {
        if (worldSpace === void 0) { worldSpace = true; }
        var pos = data.GetPos();
        if (worldSpace) {
            pos.add(Renderer.GetTopLeftVector());
        }
        ctx.fillStyle = data.GetColor().ToString();
        ctx.font = size.toString() + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data.name, pos.x, pos.y);
    };
    Renderer.Render = function (canvas, ctx, serverData) {
        var dt = 0; //serverData.pop().dt;
        var topLeftX = canvas.width / 2 - Renderer.cameraPos.x;
        var topLeftY = canvas.height / 2 - Renderer.cameraPos.y;
        Renderer.topLeftPos = new vector_1.Vector(topLeftX, topLeftY);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
        ctx.beginPath(); // draw grid
        for (var x = 1; x <= Renderer.worldHorizontalUnits; x++) {
            var finalX = topLeftX + x * Renderer.worldUnitSize;
            ctx.moveTo(finalX, topLeftY);
            ctx.lineTo(finalX, topLeftY + Renderer.worldHeight);
        }
        for (var y = 1; y <= Renderer.worldVerticalUnits; y++) {
            var finalY = topLeftY + y * Renderer.worldUnitSize;
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
        Renderer.worldData.forEach(function (data) {
            var dataPack = data_1.DataPack.Cast(data);
            Renderer.DrawSquare(ctx, dataPack);
        });
        var toRemoveWorldData = [];
        Renderer.deadBodies.forEach(function (data, id) {
            data.a -= 0.01;
            if (data.a <= 0)
                toRemoveWorldData.push(id);
            else
                Renderer.DrawSquare(ctx, data_1.DataPack.Cast(data));
        });
        if (toRemoveWorldData.length > 0) {
            console.log("deleting dead bodies");
        }
        for (var _i = 0, toRemoveWorldData_1 = toRemoveWorldData; _i < toRemoveWorldData_1.length; _i++) {
            var id = toRemoveWorldData_1[_i];
            Renderer.deadBodies.delete(id);
        }
        for (var i = 0; i < serverData.length; i++) {
            var data = data_1.DataPack.Cast(serverData[i]);
            var rgbText = data.GetColor().ToString();
            switch (data.type) {
                case unitType_1.UnitType.None: // debug
                    Renderer.DrawSquare(ctx, data);
                    break;
                case unitType_1.UnitType.Player:
                    if (data.id == Renderer.id) {
                        // our player
                        data.x = canvas.width / 2 - data.sx / 2;
                        data.y = canvas.height / 2 - data.sy / 2;
                        data.y += (data.sx - data.sy) / 2;
                        Renderer.DrawSquare(ctx, data, false);
                    }
                    else {
                        // other players
                        Renderer.DrawSquare(ctx, data);
                        data.x += data.sx / 2;
                        data.y -= 5;
                        Renderer.DrawText(ctx, data, 15);
                    }
                    break;
                case unitType_1.UnitType.Bullet:
                    if (data.id == Renderer.id)
                        data.SetColor(color_1.Color.Red);
                    Renderer.DrawSquare(ctx, data);
                    break;
                case unitType_1.UnitType.UI:
                    if (data.id != Renderer.id)
                        continue;
                    ctx.fillStyle = rgbText;
                    ctx.fillRect(data.x, data.y, data.sx, data.sy);
                    break;
                case unitType_1.UnitType.QuadTree: // QuadTreeNode
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
    };
    Renderer.gridColor = "rgba(0,0,255,0.1)"; // transparent blue
    Renderer.worldData = [];
    Renderer.deadBodies = new Map();
    return Renderer;
}());
exports.Renderer = Renderer;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
var color_1 = require("../../shared/color");
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
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
        Renderer.deadBodies.set(data.id.toString(), data);
    };
    Renderer.Render = function (canvas, ctx, data) {
        var dt = data.pop().dt;
        var topLeftX = canvas.width / 2 - Renderer.cameraPos.x;
        var topLeftY = canvas.height / 2 - Renderer.cameraPos.y;
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
        ctx.beginPath();
        Renderer.worldData.forEach(function (dataPack) {
            var finalX = canvas.width / 2 + dataPack.x - Renderer.cameraPos.x;
            var finalY = canvas.height / 2 + dataPack.y - Renderer.cameraPos.y;
            ctx.fillStyle = color_1.Color.Black.ToString();
            ctx.fillRect(finalX, finalY, dataPack.sx, dataPack.sy);
        });
        ctx.beginPath();
        var toRemoveWorldData = [];
        Renderer.deadBodies.forEach(function (dataPack, id) {
            dataPack.a -= 0.01;
            if (dataPack.a <= 0)
                toRemoveWorldData.push(id);
            var finalX = canvas.width / 2 + dataPack.x - Renderer.cameraPos.x;
            var finalY = canvas.height / 2 + dataPack.y - Renderer.cameraPos.y;
            var rgbText = "rgba(" +
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
        for (var _i = 0, toRemoveWorldData_1 = toRemoveWorldData; _i < toRemoveWorldData_1.length; _i++) {
            var id = toRemoveWorldData_1[_i];
            Renderer.deadBodies.delete(id);
        }
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var rgbText = "rgba(" + d.r + "," + d.g + "," + d.b + "," + d.a + ")";
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
                        var offset = (d.sx - d.sy) / 2;
                        d.x = canvas.width / 2 - d.sx / 2;
                        d.y = canvas.height / 2 - d.sy / 2 + offset;
                    }
                    else {
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
                    if (d.id != Renderer.id)
                        rgbText = "rgba(0,0,0,0)";
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
    };
    Renderer.gridColor = "rgba(0,0,255,0.1)"; // transparent blue
    Renderer.worldData = [];
    Renderer.deadBodies = new Map();
    return Renderer;
}());
exports.Renderer = Renderer;

"use strict";
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    ;
    Renderer.SetPlayerId = function (data) {
        Renderer.id = data.id;
        //console.log(" id set to " + Renderer.id );
    };
    Renderer.SetCameraPos = function (pos) {
        Renderer.cameraPos = pos;
    };
    Renderer.SetWorldData = function (data) {
        Renderer.worldData = data;
    };
    Renderer.SetWorldSize = function (data) {
        Renderer.worldWidth = data.width;
        Renderer.worldHeight = data.height;
        Renderer.worldHorizontalUnits = data.horizontalUnits;
        Renderer.worldVerticalUnits = data.verticalUnits;
        Renderer.worldUnitSize = data.size;
    };
    Renderer.AddWorldData = function (data) {
        console.log("dead added");
        Renderer.worldData.push(data);
    };
    Renderer.RemoveFromWorldData = function (data) {
        console.log("dead removed");
        var i = Renderer.worldData.indexOf(data);
        delete Renderer.worldData[i];
        Renderer.worldData.splice(i, 1);
    };
    Renderer.Render = function (canvas, ctx, data) {
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var worldWidth = Renderer.worldWidth;
        var worldHeight = Renderer.worldHeight;
        var worldHorizontalUnits = Renderer.worldHorizontalUnits;
        var worldVerticalUnits = Renderer.worldVerticalUnits;
        var topLeftX = (canvasWidth / 2) - Renderer.cameraPos.x;
        var topLeftY = (canvasHeight / 2) - Renderer.cameraPos.y;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        for (var x = 1; x <= worldHorizontalUnits; x++) {
            var finalX = topLeftX + (x * Renderer.worldUnitSize);
            ctx.moveTo(finalX, topLeftY);
            ctx.lineTo(finalX, topLeftY + worldHeight);
        }
        for (var y = 1; y <= worldVerticalUnits; y++) {
            var finalY = topLeftY + (y * Renderer.worldUnitSize);
            ctx.moveTo(topLeftX, finalY);
            ctx.lineTo(topLeftX + worldWidth, finalY);
        }
        ctx.strokeStyle = Renderer.gridColor;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(topLeftX, topLeftY);
        ctx.lineTo(topLeftX, topLeftY + worldHeight);
        ctx.moveTo(topLeftX + worldWidth, topLeftY);
        ctx.lineTo(topLeftX + worldWidth, topLeftY + worldHeight);
        ctx.moveTo(topLeftX, topLeftY);
        ctx.lineTo(topLeftX + worldWidth, topLeftY);
        ctx.moveTo(topLeftX, topLeftY + worldHeight);
        ctx.lineTo(topLeftX + worldWidth, topLeftY + worldHeight);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.stroke();
        ctx.beginPath();
        var toRemoveWorldData = [];
        for (var i = 0; i < Renderer.worldData.length; i++) {
            var d = Renderer.worldData[i];
            if (d.type == 1 && d.a > 0) {
                d.a -= 0.01;
                if (d.a < 0)
                    toRemoveWorldData.push(d);
            }
            var finalX = (canvasWidth / 2) + d.x - Renderer.cameraPos.x;
            var finalY = (canvasHeight / 2) + d.y - Renderer.cameraPos.y;
            var rgbText = "rgba(" + d.r + "," + d.g + "," + d.b + "," + d.a + ")";
            ctx.fillStyle = rgbText;
            ctx.fillRect(finalX, finalY, d.sx, d.sy);
        }
        ctx.stroke();
        ctx.beginPath();
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var rgbText = "rgba(" + d.r + "," + d.g + "," + d.b + "," + d.a + ")";
            if (d.id == Renderer.id && d.type == 2) { // bullet
                rgbText = "rgb(255,0,0)";
            }
            switch (d.type) {
                case 0:
                    d.x += Renderer.cameraPos.x;
                    d.y += Renderer.cameraPos.y;
                    break;
                case 1:
                    if (d.id == Renderer.id) {
                        d.x = (canvasWidth / 2) - (d.sx / 2);
                        d.y = (canvasHeight / 2) - (d.sy / 2);
                    }
                    else {
                        d.x += (canvasWidth / 2) - Renderer.cameraPos.x;
                        d.y += (canvasHeight / 2) - Renderer.cameraPos.y;
                    }
                    break;
                case 2:
                    d.x += (canvasWidth / 2) - Renderer.cameraPos.x;
                    d.y += (canvasHeight / 2) - Renderer.cameraPos.y;
                    break;
            }
            ctx.fillStyle = rgbText;
            ctx.fillRect(d.x, d.y, d.sx, d.sy);
            if (d.name !== "") {
                ctx.fillStyle = "rgb(100,100,100)";
                ;
                ctx.font = "15px Arial";
                ctx.fillText(d.name, d.x, d.y);
            }
        }
        ctx.stroke();
        for (var _i = 0, toRemoveWorldData_1 = toRemoveWorldData; _i < toRemoveWorldData_1.length; _i++) {
            var d = toRemoveWorldData_1[_i];
            Renderer.RemoveFromWorldData(d);
        }
    };
    Renderer.gridColor = "rgba(0,0,255,0.2)"; // transparent blue
    Renderer.worldData = [];
    //static inst:Renderer = new Renderer();
    Renderer.id = -1;
    return Renderer;
}());

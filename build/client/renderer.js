"use strict";
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    ;
    Renderer.SetPlayerId = function (data) {
        Renderer.id = data.id;
        //console.log(" id set to " + Renderer.id );
    };
    Renderer.SetWorldData = function (data) {
        Renderer.worldData = data;
    };
    Renderer.AddWorldData = function (data) {
        console.log("dead added");
        Renderer.worldData.push(data);
    };
    Renderer.Render = function (canvas, ctx, data) {
        var w = canvas.width;
        var h = canvas.width;
        ctx.clearRect(0, 0, w, h);
        for (var x = 30; x <= w; x += 30) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, w);
        }
        for (var x = 30; x <= h; x += 30) {
            ctx.moveTo(0, x);
            ctx.lineTo(w, x);
        }
        ctx.strokeStyle = Renderer.gridColor;
        ctx.stroke();
        ctx.beginPath();
        for (var i = 0; i < Renderer.worldData.length; i++) {
            var data_1 = Renderer.worldData[i];
            var pos = data_1.pos;
            var color = data_1.color;
            var sizeX = data_1.sizeX;
            var sizeY = data_1.sizeY;
            var rgbText = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
            ctx.fillStyle = rgbText;
            ctx.fillRect(pos.x, pos.y, sizeX, sizeY);
        }
        ctx.stroke();
        ctx.beginPath();
        for (var i = 0; i < data.length; i++) {
            var pos = data[i].pos;
            var color = data[i].color;
            var sizeX = data[i].sizeX;
            var sizeY = data[i].sizeY;
            var rgbText = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
            if (data[i].id == Renderer.id) {
                rgbText = "rgb(255,0,0)";
            }
            ctx.fillStyle = rgbText;
            ctx.fillRect(pos.x, pos.y, sizeX, sizeY);
        }
        ctx.stroke();
    };
    Renderer.gridColor = "rgba(0,0,255,0.2)"; // transparent blue
    Renderer.worldData = [];
    //static inst:Renderer = new Renderer();
    Renderer.id = -1;
    return Renderer;
}());

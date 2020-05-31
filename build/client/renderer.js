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
    Renderer.RemoveFromWorldData = function (data) {
        console.log("dead removed");
        var i = Renderer.worldData.indexOf(data);
        delete Renderer.worldData[i];
        Renderer.worldData.splice(i, 1);
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
        var toRemoveWorldData = [];
        for (var i = 0; i < Renderer.worldData.length; i++) {
            var d = Renderer.worldData[i];
            if (d.type == 1 && d.a > 0) {
                d.a -= 0.01;
                if (d.a < 0)
                    toRemoveWorldData.push(d);
            }
            var rgbText = "rgba(" + d.r + "," + d.g + "," + d.b + "," + d.a + ")";
            ctx.fillStyle = rgbText;
            ctx.fillRect(d.x, d.y, d.sx, d.sy);
        }
        ctx.stroke();
        ctx.beginPath();
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var rgbText = "rgb(" + d.r + "," + d.g + "," + d.b + ")";
            if (d.id == Renderer.id && d.type == 2) {
                rgbText = "rgb(255,0,0)";
            }
            ctx.fillStyle = rgbText;
            ctx.fillRect(d.x, d.y, d.sx, d.sy);
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

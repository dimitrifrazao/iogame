class Renderer{
    
    static gridColor: string = "rgba(0,0,255,0.2)"; // transparent blue
    static worldData:any[] = [];
    constructor(){    };

    static SetWorldData(data:any[]){
        Renderer.worldData = data;
    }

    static Render(canvas:any, ctx:any, data:any){
        let w = canvas.width;
        let h = canvas.width;

        ctx.clearRect(0,0, w, h);

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
        for(var i=0; i<Renderer.worldData.length; i++){
            let data = Renderer.worldData[i];
            let pos = data.pos;
            let color = data.color;
            let sizeX = data.sizeX;
            let sizeY = data.sizeY;
            let rgbText = "rgb(" + color.r+ "," + color.g + "," + color.b + ")";
            ctx.fillStyle = rgbText;
            ctx.fillRect(pos.x, pos.y, sizeX, sizeY);            
        }
        ctx.stroke();

        ctx.beginPath();
        for(var i=0; i<data.length; i++){
            let pos = data[i].pos;
            let color = data[i].color;
            let sizeX = data[i].sizeX;
            let sizeY = data[i].sizeY;
            let rgbText = "rgb(" + color.r+ "," + color.g + "," + color.b + ")";
            ctx.fillStyle = rgbText;
            ctx.fillRect(pos.x, pos.y, sizeX, sizeY);            
        }
        ctx.stroke();
    }
}
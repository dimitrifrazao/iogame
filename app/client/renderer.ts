class Renderer{
    
    static gridColor: string = "rgba(0,0,255,0.2)"; // transparent blue
    static worldData:any[] = [];
    //static inst:Renderer = new Renderer();
    static id:number = -1
    constructor(){   };
    
    static SetPlayerId(data:any){
        Renderer.id = data.id;
        //console.log(" id set to " + Renderer.id );
    }

    static SetWorldData(data:any[]){
        Renderer.worldData = data;
    }

    static AddWorldData(data:any){
        console.log("dead added")
        Renderer.worldData.push(data);
    }

    static RemoveFromWorldData(data:any){
        console.log("dead removed")
        let i = Renderer.worldData.indexOf(data);
        delete Renderer.worldData[i];
        Renderer.worldData.splice(i,1);
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
        let toRemoveWorldData:any[] = []
        for(var i=0; i<Renderer.worldData.length; i++){
            let d = Renderer.worldData[i];
            if(d.type == 1 && d.a > 0){
                d.a -= 0.01;
                if(d.a < 0) toRemoveWorldData.push(d);
            }
            let rgbText = "rgba(" + d.r+ "," + d.g + "," + d.b + "," + d.a + ")";
            ctx.fillStyle = rgbText;
            ctx.fillRect(d.x, d.y, d.sx, d.sy);     
        }
        ctx.stroke();

        ctx.beginPath();
        for(var i=0; i<data.length; i++){
            let d = data[i];
            let rgbText = "rgba(" + d.r+ "," + d.g + "," + d.b + "," + d.a + ")";
            if(d.id == Renderer.id && d.type ==2){
                rgbText = "rgb(255,0,0)";
            }
            ctx.fillStyle = rgbText;
            ctx.fillRect(d.x, d.y, d.sx, d.sy); 
            
            if(d.name !== ""){
                ctx.fillStyle = "rgb(100,100,100)";;
                ctx.font = "15px Arial";
                ctx.fillText(d.name, d.x, d.y);
            }
            
        }
        ctx.stroke();

        for(let d of toRemoveWorldData){
            Renderer.RemoveFromWorldData(d);
        }
    }
}
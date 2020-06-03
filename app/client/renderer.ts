class Renderer{
    
    static gridColor: string = "rgba(0,0,255,0.1)"; // transparent blue
    static worldData:any[] = [];
    //static inst:Renderer = new Renderer();
    static id:number = -1
    static cameraPos:any;
    static worldWidth:number;
    static worldHeight:number;
    static worldUnitSize:number;
    static worldHorizontalUnits:number;
    static worldVerticalUnits:number;
    constructor(){   };
    
    static SetPlayerId(data:any){
        Renderer.id = data.id;
        //console.log(" id set to " + Renderer.id );
    }

    static SetCameraPos(pos:any){
        Renderer.cameraPos = pos;
    }

    static SetWorldData(data:any){
        Renderer.worldData = data;
    }

    static SetWorldSize(data:any){
        Renderer.worldWidth = data.width;
        Renderer.worldHeight = data.height;
        Renderer.worldHorizontalUnits = data.horizontalUnits;
        Renderer.worldVerticalUnits = data.verticalUnits;
        Renderer.worldUnitSize = data.size;
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
        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;
        let worldWidth = Renderer.worldWidth;
        let worldHeight = Renderer.worldHeight;
        let worldHorizontalUnits = Renderer.worldHorizontalUnits;
        let worldVerticalUnits = Renderer.worldVerticalUnits;

        let topLeftX = (canvasWidth/2) - Renderer.cameraPos.x
        let topLeftY = (canvasHeight/2) - Renderer.cameraPos.y;

        ctx.clearRect(0,0, canvasWidth, canvasHeight);

        ctx.beginPath();

        for (var x = 1; x <= worldHorizontalUnits; x++)  {
            let finalX =  topLeftX + (x*Renderer.worldUnitSize);
            ctx.moveTo(finalX, topLeftY);
            ctx.lineTo(finalX, topLeftY + worldHeight);
        }

        for (var y = 1; y <= worldVerticalUnits; y ++) {
            let finalY = topLeftY + (y*Renderer.worldUnitSize) ;
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
        ctx.moveTo(topLeftX , topLeftY + worldHeight);
        ctx.lineTo(topLeftX + worldWidth, topLeftY + worldHeight);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.stroke();

        ctx.beginPath();
        let toRemoveWorldData:any[] = []
        for(var i=0; i<Renderer.worldData.length; i++){
            let d = Renderer.worldData[i];
            if(d.type == 1 && d.a > 0){
                d.a -= 0.01;
                if(d.a < 0) toRemoveWorldData.push(d);
            }

            let finalX = (canvasWidth/2) + d.x - Renderer.cameraPos.x;
            let finalY = (canvasHeight/2) + d.y - Renderer.cameraPos.y;

            let rgbText = "rgba(" + d.r+ "," + d.g + "," + d.b + "," + d.a + ")";
            ctx.fillStyle = rgbText;
            ctx.fillRect(finalX, finalY, d.sx, d.sy);     
        }
        ctx.stroke();

        ctx.beginPath();
        for(var i=0; i<data.length; i++){
            let d = data[i];
            let rgbText = "rgba(" + d.r+ "," + d.g + "," + d.b + "," + d.a + ")";

            if(d.id == Renderer.id && d.type ==2){ // bullet
                rgbText = "rgb(255,0,0)";
            }
            
            switch(d.type){
                case 0: // world static
                    d.x += Renderer.cameraPos.x;
                    d.y += Renderer.cameraPos.y;
                    break;

                case 1: // players
                    if(d.id == Renderer.id){ // our player
                        let offset = (d.sx - d.sy)/2;
                        d.x = (canvasWidth/2) - (d.sx/2);
                        d.y = (canvasHeight/2) - (d.sy/2) + offset;
                    }
                    else{ // other players
                        d.x += (canvasWidth/2) - Renderer.cameraPos.x;
                        d.y += (canvasHeight/2) - Renderer.cameraPos.y;
                    }
                    break;
                case 2: // bullets
                    d.x += (canvasWidth/2) - Renderer.cameraPos.x;
                    d.y += (canvasHeight/2) - Renderer.cameraPos.y;
                    break

                case 3: //UI
                    if(d.id != Renderer.id) rgbText = "rgba(0,0,0,0)";
                    break;
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
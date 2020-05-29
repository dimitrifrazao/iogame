import {Vector, Color} from "../gameObjects/transform";

export class World{
    public static inst:World = new World(50, 40);
    public static unitSize = 30;
    private rocks:Cell[] = [];

    constructor(private hUnits:number, private vUnits:number){
    }
    
    GetHorizontalUnits(){return this.hUnits * World.unitSize;};
    GetVerticalUnits(){return this.vUnits * World.unitSize;};
    GetCellCount(){return this.hUnits * this.vUnits;};
    GetXValue(i:number){ return (i% this.hUnits) * World.unitSize;};
    GetYValue(i:number){ return (Math.trunc(i / this.vUnits))*World.unitSize;};
    Build(){
        let cellsCount = this.GetCellCount();
        for(let i=0; i<cellsCount; i++){
            let x = this.GetXValue(i);
            let y = this.GetYValue(i);
            if( (Math.random() * 100) > 98){
                this.rocks.push(new Cell(new Vector(x,y),CellType.Rock));
            }

        } 
    }

    GenerateDataPack(){        
        let pack:object[] = [];
        for(let cell of this.rocks){
            pack.push({
                pos: cell.pos,
                color: Color.Black,
                sizeX: World.unitSize,
                sizeY: World.unitSize
            });
        }
        return pack;
    }
}

export class Cell{
    constructor(public pos:Vector, public cellType:CellType){};
    IsRock():boolean{return this.cellType == CellType.Rock;}
}

export enum CellType{
    Empty=0,
    Rock=1,
}

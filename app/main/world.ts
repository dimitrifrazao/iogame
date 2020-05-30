import {Vector, Color, Cell, CellType} from "../gameObjects/transform";

export class World{
    public static inst:World = new World(50, 40);
    public static unitSize = 30.0;
    private rocks:Cell[] = [];
    private deads:any[] = [];
    private cells:Cell[] = [];

    constructor(private hUnits:number, private vUnits:number){
    }
    
    GetHorizontalUnits(){return this.hUnits * World.unitSize;};
    GetVerticalUnits(){return this.vUnits * World.unitSize;};
    GetCellCount(){return this.hUnits * this.vUnits;};

    GetXValue(i:number){ return (i% this.hUnits) * World.unitSize;};
    GetYValue(i:number){ return (Math.floor(i / this.hUnits))*World.unitSize;};
    GetIndex(pos:Vector){
        let wPos = Vector.Wrap(pos, this.GetHorizontalUnits(), this.GetVerticalUnits());
        return (((Math.floor(wPos.y / World.unitSize)) * this.hUnits) + (Math.floor(wPos.x / World.unitSize)))
    }

    WrapIndex(i:number){
        if(i<0) return this.GetCellCount() + i;
        else if(i > this.GetCellCount()) return i - this.GetCellCount();
        return i;
    }

    GetSurroundingCells(i:number):Cell[]{
        let cells:Cell[] = []
        cells.push(this.cells[i]);
        cells.push(this.cells[this.WrapIndex(i+1)]);
        cells.push(this.cells[this.WrapIndex(i-1)]);
        cells.push(this.cells[this.WrapIndex(i-this.hUnits)]);
        cells.push(this.cells[this.WrapIndex(i-this.hUnits+1)]);
        cells.push(this.cells[this.WrapIndex(i-this.hUnits-1)]);
        cells.push(this.cells[this.WrapIndex(i+this.hUnits)]);
        cells.push(this.cells[this.WrapIndex(i+this.hUnits+1)]);
        cells.push(this.cells[this.WrapIndex(i+this.hUnits-1)]);
        
        return cells;
    }

    GetPossibleCollisions(pos:Vector):Cell[]{
        return this.GetSurroundingCells(this.GetIndex(pos));
    }

    Build(){
        let cellsCount = this.GetCellCount();
        for(let i=0; i<cellsCount; i++){
            let x = this.GetXValue(i) + (World.unitSize/2);
            let y = this.GetYValue(i) + (World.unitSize/2);
            let c = new Cell(x,y, World.unitSize)
            if( (Math.random() * 100) > 98){
                c.cellType = CellType.Rock;
                this.rocks.push(c);
            }
            this.cells.push(c);

        } 
    }

    GetRocks(){return this.rocks};

    AddDead(dead:any){
        this.deads.push(dead);
    }
    
    GenerateDataPack(){        
        let pack:object[] = [];
        for(let cell of this.rocks){
            pack.push({
                pos: cell.GetTopLeftPos(),
                color: Color.Black,
                sizeX: World.unitSize,
                sizeY: World.unitSize
            });
        }
        for(let dead of this.deads){
            pack.push(dead);
        }
        return pack;
    }
}



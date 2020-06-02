import {Cell, CellType} from "../gameObjects/transform";
import { Vector } from "../gameObjects/vector"

export class World{
    public static inst:World = new World(50, 40, 30);
    private rocks:Cell[] = [];
    private cells:Cell[] = [];

    constructor(private hUnits:number, private vUnits:number, private unitSize:number){
    }
    
    GetHorizontalUnits(){return this.hUnits;};
    GetVerticalUnits(){return this.vUnits;};
    GetUnitSize(){return this.unitSize;};
    GetHorizontalSize(){return this.hUnits * this.unitSize;};
    GetVerticalSize(){return this.vUnits * this.unitSize;};
    GetCellCount(){return this.hUnits * this.vUnits;};

    GetXValue(i:number){ return (i% this.hUnits) * this.unitSize;};
    GetYValue(i:number){ return (Math.floor(i / this.hUnits))*this.unitSize;};
    GetIndex(pos:Vector){
        let wPos = Vector.Wrap(pos, this.GetHorizontalSize(), this.GetVerticalSize());
        return (((Math.floor(wPos.y / this.unitSize)) * this.hUnits) + (Math.floor(wPos.x / this.unitSize)))
    }

    WorldWrap(pos:Vector){
        if(pos.x > this.GetHorizontalSize()) pos.x = 0;
        else if(pos.x < 0) pos.x = this.GetHorizontalSize();
        if(pos.y > this.GetVerticalSize()) pos.y = 0;
        else if(pos.y < 0) pos.y = this.GetVerticalSize();
    }

    WrapIndex(i:number){
        if(i<0) return this.GetCellCount() + i;
        else if(i > this.GetCellCount()) return i - this.GetCellCount();
        return i;
    }

    GetSurroundingCells(i:number):Cell[]{
        let cells:Cell[] = []
        cells.push(this.cells[this.WrapIndex(i)]);
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
            let x = this.GetXValue(i) + (this.unitSize/2);
            let y = this.GetYValue(i) + (this.unitSize/2);

            let c = new Cell();
            c.SetPos(new Vector(x,y));
            c.SetSize(new Vector(this.unitSize, this.unitSize))

            if( (Math.random() * 100) > 98){
                c.cellType = CellType.Rock;
                this.rocks.push(c);
            }
            this.cells.push(c);

        } 
    }

    GetRocks(){return this.rocks};
    
    GenerateDataPack():object[]{        
        let pack:object[] = [];
        for(let cell of this.rocks){
            pack.push(cell.GetDataPack());
        }
        return pack;
    }

    GetWorldSize():object{
        return {
            width:World.inst.GetHorizontalSize(), 
            height:World.inst.GetVerticalSize(),
            horizontalUnits:World.inst.GetHorizontalUnits(),
            verticalUnits:World.inst.GetVerticalUnits(),
            size:World.inst.GetUnitSize()};
    }
}



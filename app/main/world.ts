import {Cell, CellType, Transform} from "../gameObjects/transform";
import { Vector } from "../gameObjects/vector"

export class World{
    public static inst:World = new World(50, 40, 30);
    private rocks:Cell[] = [];
    private cells:Cell[] = [];
    private surroundingIndexes: number[] = []
    constructor(private hUnits:number, private vUnits:number, private unitSize:number){

        this.surroundingIndexes.push(0);
        this.surroundingIndexes.push(1);
        this.surroundingIndexes.push(-1);

        this.surroundingIndexes.push(this.hUnits);
        this.surroundingIndexes.push(1 + this.hUnits);
        this.surroundingIndexes.push(-1 + this.hUnits);

        this.surroundingIndexes.push(-this.hUnits);
        this.surroundingIndexes.push(1 -this.hUnits);
        this.surroundingIndexes.push(-1 -this.hUnits);
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

    WorldWrap(pos:Vector):void{
        if(pos.x > this.GetHorizontalSize()) pos.x = 0;
        else if(pos.x < 0) pos.x = this.GetHorizontalSize();
        if(pos.y > this.GetVerticalSize()) pos.y = 0;
        else if(pos.y < 0) pos.y = this.GetVerticalSize();
    }

    WorldWrapVector(pos:Vector):Vector{
        let vec = new Vector();
        if(pos.x > this.GetHorizontalSize()) vec.x = -this.GetHorizontalSize()
        else if(pos.x < 0) vec.x = this.GetHorizontalSize();
        if(pos.y > this.GetVerticalSize()) vec.y = -this.GetVerticalSize();
        else if(pos.y < 0) vec.y = this.GetVerticalSize();
        return vec;
    }
    
    WorldWrapTransform(trans:Transform){
        let wrapVec = this.WorldWrapVector(trans.GetPos())
        if(wrapVec.len() > 1){
            trans.AddPos(wrapVec);
            trans.AddPreviousPos(wrapVec);
        }
    }

    WrapIndex(i:number){
        if(i<0) return this.GetCellCount() + i;
        else if(i > this.GetCellCount()) return i - this.GetCellCount();
        return i;
    }

    GetSurroundingCells(i:number):Cell[]{
        let cells:Cell[] = []
        for(let cellIndex of this.surroundingIndexes){
            let cell = this.cells[this.WrapIndex(i+cellIndex)];
            if(cell != undefined) cells.push(cell)
        }
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



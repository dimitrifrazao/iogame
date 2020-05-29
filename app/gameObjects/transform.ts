
import {World} from "../main/world";
export * from "../main/world";

export enum DirEnum {
    None=0,
    Up=1,
    Down=2,
    Left=3,
    Right=4,
    UpLeft=5,
    UpRight=6,
    DownLeft=7,
    DownRight=8
}

export class Color{
    static maxValue:number = 255;
    static Black:Color = new Color(0,0,0);
    static Red:Color = new Color(255,0,0);
    static Green:Color = new Color(0,255,0);
    static Blue:Color = new Color(0,0,255);
    static Grey:Color = new Color(200,200,200);
    constructor(public r:number=0, public g:number=0, public b:number=0){}
    static Random(){
        return new Color(
            (Math.random() * 100) + 100, 
            (Math.random() * 100) + 100, 
            (Math.random() * 100) + 100
        )
    };
}

export class Vector{    
    constructor(public x:number=0, public y:number=0){}
    add(vec:Vector){
        this.x += vec.x;
        this.y += vec.y;
    };
    sub(vec:Vector){
        this.x -= vec.x;
        this.y -= vec.y;
    };
    len():number{return Math.sqrt( (this.x*this.x) + (this.y*this.y) )};
    normal():Vector{return new Vector(this.x/this.len(), this.y/this.len())};
    normalize():void{
        this.x /= this.len();
        this.y /= this.len();
    }
    scaleBy(scale:number):void{
        this.x *= scale;
        this.y *= scale;
    }
    distaceTo(target:Vector):number{
        return Vector.Sub(target, this).len();
    }
    wrap(x:number, y:number){
        if(this.x < 0) this.x += x;
        else this.x = this.x % x;
        if(this.y < 0) this.y += y;
        else this.y = this.y % y;
    }

    static Up:Vector = new Vector(0,-1);
    static Down:Vector = new Vector(0,1);
    static Left:Vector = new Vector(-1,0);
    static Right:Vector = new Vector(1,0);
    static UpLeft:Vector = new Vector(-1,-1).normal();
    static UpRight:Vector = new Vector(1,-1).normal();
    static DownLeft:Vector = new Vector(-1,1).normal();
    static DownRight:Vector = new Vector(1,1).normal();

    static GetDirVector(dir:DirEnum):Vector{
        switch(dir){
            case DirEnum.Up:
                return Vector.Up;
                break;
            case DirEnum.Down:
                return Vector.Down;
                break;
            case DirEnum.Left:
                return Vector.Left;
                break;
            case DirEnum.Right:
                return Vector.Right;
                break;
            default:
                return new Vector();
                break;
        }
    }

    static Copy(vec:Vector){return new Vector(vec.x, vec.y);};

    static Add(vec1: Vector, vec2:Vector){
        return new Vector(vec1.x+vec2.x, vec1.y+vec2.y);
    }
    static Sub(vec1: Vector, vec2:Vector){
        return new Vector(vec1.x-vec2.x, vec1.y-vec2.y);
    }

    static ScaleBy(vec:Vector, scale:number){
        let newVec = new Vector(vec.x, vec.y);
        newVec.scaleBy(scale);
        return newVec;
    }

    static Wrap(vec:Vector, x:number, y:number):Vector{
        let wrappedVec = Vector.Copy(vec);
        wrappedVec.wrap(x,y);
        return wrappedVec
    }

    static GetInbetween(pos1:Vector, pos2:Vector){
        let pos3 = Vector.Sub(pos2, pos1);
        pos3.scaleBy(0.5)
        pos3.add(pos1);
        return pos3;
    }
    
}

export class Transform {
    pos:Vector;
    public sizeX:number;
    public sizeY:number;
    constructor(x:number=0, y:number=0, sizeX:number, sizeY:number){
        this.pos = new Vector(x,y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
    CheckCollision(trans:Transform):boolean{
        return (Math.abs(this.pos.x - trans.pos.x ) < (this.sizeX + trans.sizeX)/2 ) && 
        (Math.abs(this.pos.y - trans.pos.y ) < (this.sizeY + trans.sizeY)/2 );
    };

    GetOverlap(trans:Transform):Transform{
        let overLapPos = Vector.GetInbetween(this.pos, trans.pos);
        let newX = Math.min( Math.abs(this.GetBotRightPos().x - trans.GetTopLeftPos().x), Math.abs(this.GetTopLeftPos().x - trans.GetBotRightPos().x));
        let newY = Math.min( Math.abs(this.GetBotRightPos().y - trans.GetTopLeftPos().y), Math.abs(this.GetTopLeftPos().y - trans.GetBotRightPos().y));
        return new Transform(overLapPos.x, overLapPos.y, newX, newY);
    }

    ApplyOverlapPush(overlap:Transform){
        if(overlap.sizeX < overlap.sizeY){
            if(overlap.pos.x > this.pos.x){
                this.pos.x -= overlap.sizeX;
            }
            else{
                this.pos.x += overlap.sizeX;
            }
        }
        else{
            if(overlap.pos.y > this.pos.y){
                this.pos.y -= overlap.sizeY;
            }
            else{
                this.pos.y += overlap.sizeY;
            }
        }
        
    }

    GetTopLeftPos(){
        return new Vector(this.pos.x - (this.sizeX/2), this.pos.y - (this.sizeY/2))
    };

    GetBotRightPos(){
        return new Vector(this.pos.x + (this.sizeX/2), this.pos.y + (this.sizeY/2))
    }

    GetArea(){
        return this.sizeX * this.sizeY;
    }

    CheckWorldWrap(){
        if(this.pos.x > World.inst.GetHorizontalUnits()) this.pos.x = -this.sizeX;
        if(this.pos.x < -this.sizeX) this.pos.x = World.inst.GetHorizontalUnits();
        if(this.pos.y > World.inst.GetVerticalUnits()) this.pos.y = -this.sizeY;
        if(this.pos.y < -this.sizeY) this.pos.y = World.inst.GetVerticalUnits();
    }

    static GetMirrorDir(dir:DirEnum){
        switch(dir){
            case DirEnum.Left: return DirEnum.Right;
            case DirEnum.Right: return DirEnum.Left;
            case DirEnum.Up: return DirEnum.Down;
            case DirEnum.Down: return DirEnum.Up;
            case DirEnum.UpLeft: return DirEnum.DownRight;
            case DirEnum.UpRight: return DirEnum.DownLeft;
        }
        return DirEnum.None;
    }
}

export interface IMove{
    dir: DirEnum;
    speed: number;
    UpdatePosition(dt:number):void;
}

export class Cell extends Transform{
    constructor(x:number, y:number, worldUnitSize:number, public cellType:CellType=CellType.Empty){
        super(x,y, worldUnitSize,worldUnitSize);
    };
    IsRock():boolean{return this.cellType == CellType.Rock;}
}

export enum CellType{
    Empty=0,
    Rock=1,
}

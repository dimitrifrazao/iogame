
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
    GetTopLeftPos(){
        return new Vector(this.pos.x - (this.sizeX/2), this.pos.y - (this.sizeY/2))
    };

    CheckWorldWrap(){
        if(this.pos.x > World.inst.GetHorizontalUnits()) this.pos.x = -this.sizeX;
        if(this.pos.x < -this.sizeX) this.pos.x = World.inst.GetHorizontalUnits();
        if(this.pos.y > World.inst.GetVerticalUnits()) this.pos.y = -this.sizeY;
        if(this.pos.y < -this.sizeY) this.pos.y = World.inst.GetVerticalUnits();
    }
}

export interface IMove{
    dir: DirEnum;
    speed: number;
    UpdatePosition(dt:number):void;
}

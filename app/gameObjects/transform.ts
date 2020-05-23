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

export function convertDirString(dir: string):DirEnum{
    switch(dir){
        case "up":
            return DirEnum.Up;
            break;
        case "down":
            return DirEnum.Down;
            break
        case "left":
            return DirEnum.Left;
            break;
        case "right":
            return DirEnum.Right;
            break;
    }
    return DirEnum.None;
}

export class Color{
    static maxValue:number = 255;
    static Black:Color = new Color(0,0,0);
    static Red:Color = new Color(255,0,0);
    constructor(public r:number=0, public g:number=0, public b:number=0){}
    static CreateRandom(){
        return new Color(
            Math.random() * Color.maxValue, 
            Math.random() * Color.maxValue, 
            Math.random() * Color.maxValue);
    };
}

export class Vector{
    constructor(public x:number=0, public y:number=0){}
    add(vec:Vector):Vector{return new Vector(this.x + vec.x, this.y + vec.y)};
    sub(vec:Vector):Vector{return new Vector(this.x - vec.x, this.y - vec.y)};
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
        return target.sub(this).len();
    }
}

export class Transform {
    pos:Vector;
    public sizeX:number;
    public sizeY:number;
    constructor(x:number=0, y:number=0, sizeX:number=1, sizeY:number=1){
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
}

export interface IMove{
    dir: DirEnum;
    speed: number;
    UpdatePosition(dt:number):void;
}



/*module.exports = {
    convertDirEnum: convertDirString
};*/
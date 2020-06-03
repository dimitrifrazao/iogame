
import { World } from "../main/world";
import { Vector } from "./vector";
import { Color } from "./color";
import { DirEnum } from "./interfaces/imove";
import { GameObject } from "./gameObject";
import { BoundingBox } from "./boundingBox";


export enum UnitType{
    None=0,
    Player=1,
    Bullet=2,
    UI=3
}

export class DataPack{
    x:number=0;
    y:number=0;
    r:number=0;
    g:number=0;
    b:number=0;
    a:number=1;
    sx:number=0;
    sy:number=0;
    id:number=0;
    type:UnitType = UnitType.None;
    name:string="";
    constructor(){
    }
    SetPos(pos:Vector){
        this.x = pos.x;
        this.y = pos.y;
    }
    SetColor(color:Color){
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }
}

export class Transform extends GameObject{
    protected id:number = -1;
    protected type:UnitType = UnitType.None;
    protected pos:Vector = new Vector();
    protected size:Vector = new Vector(1,1);
    protected color:Color = Color.DarkGrey;
    protected previousPos:Vector = new Vector();


    constructor(){super();}

    GetId():number{return this.id};;
    GetUnitType():UnitType{return this.type;};

    SetPos(pos:Vector){this.pos = pos;};
    GetPos(){return this.pos;};
    AddPos(pos:Vector){this.pos.add(pos);};

    SetPreviousPos(pos:Vector){
        this.previousPos.x = pos.x;
        this.previousPos.y = pos.y;
    };
    AddPreviousPos(pos:Vector){this.previousPos.add(pos);};
    GetPreviousPos(){return this.previousPos;};

    SetSize(size:Vector){this.size = size;};
    GetSize(){return this.size;};
    SetColor(color:Color){this.color=color;};
    GetColor(){return this.color;};

    GetBoundingBox(){return BoundingBox.MakeFrom(this);};
    GetOldBoundingBox(){ return BoundingBox.MakeFromVectorAndSize(this.GetPreviousPos(), this.GetSize());};

    GetDataPack():DataPack{
        let dPack = new DataPack();
        dPack.SetPos(this.GetTopLeftPos());
        dPack.SetColor(this.GetColor());
        dPack.sx = this.size.x,
        dPack.sy = this.size.y,
        dPack.id = this.GetId(),
        dPack.type = this.GetUnitType();
        return dPack;
    }
    CheckCollision(trans:Transform):boolean{
        return (Math.abs(this.pos.x - trans.pos.x ) < (this.size.x + trans.size.x)/2 ) && 
        (Math.abs(this.pos.y - trans.pos.y ) < (this.size.y + trans.size.y)/2 );
    };

    GetOverlap(trans:Transform):Transform{
        
        let bb1 = this.GetBoundingBox();
        let bb2 = trans.GetBoundingBox();
        let bb3 = BoundingBox.Sub(bb1, bb2);
        return bb3.GetTransform();
    }

    ApplyBulletOverlapPush(bulletStretch:Transform, overlap:Transform){
        if(bulletStretch.size.x > bulletStretch.size.y){
            this.pos.x -= overlap.size.x;
        }
        else{
            this.pos.x -= overlap.size.y;
        }
        
    }

    GetTopLeftPos(){
        return new Vector(this.pos.x - (this.size.x/2), this.pos.y - (this.size.y/2))
    };

    GetBotRightPos(){
        return new Vector(this.pos.x + (this.size.x/2), this.pos.y + (this.size.y/2))
    }

    GetArea(){
        return this.size.x * this.size.y;
    }

    CheckWorldWrap():void{
        World.inst.WorldWrapTransform(this);
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



export class Cell extends Transform{
    public cellType:CellType=CellType.Empty;
    constructor(){super();};

    IsRock():boolean{return this.cellType == CellType.Rock;}
    GetDataPack():DataPack{
        let dPack = super.GetDataPack();
        dPack.SetColor(Color.Black);
        return dPack;
    }
}

export enum CellType{
    Empty=0,
    Rock=1,
}

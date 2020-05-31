
import { World } from "../main/world";
import { Vector } from "./vector"
import { Color } from "./color"
import { DirEnum } from "./interfaces/imove"
import { GameObject } from "./gameObject"


export enum UnitType{
    None=0,
    Player=1,
    Bullet=2,
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
    protected color:Color = Color.Grey;

    constructor(){super();}

    GetId():number{return this.id};;
    GetUnitType():UnitType{return this.type;};

    SetPos(pos:Vector){this.pos = pos;};
    GetPos(){return this.pos;};
    SetSize(size:Vector){this.size = size;};
    GetSize(){return this.size;};
    SetColor(color:Color){this.color=color;};
    GetColor(){return this.color;};

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
        return (Math.abs(this.pos.x - trans.pos.x ) < (this.size.x + trans.size.y)/2 ) && 
        (Math.abs(this.pos.y - trans.pos.y ) < (this.size.y + trans.size.y)/2 );
    };

    GetOverlap(trans:Transform):Transform{
        let overLapPos = Vector.GetInbetween(this.pos, trans.pos);
        let overlapSize = new Vector();
        overlapSize.x = Math.min( Math.abs(this.GetBotRightPos().x - trans.GetTopLeftPos().x), Math.abs(this.GetTopLeftPos().x - trans.GetBotRightPos().x));
        overlapSize.y = Math.min( Math.abs(this.GetBotRightPos().y - trans.GetTopLeftPos().y), Math.abs(this.GetTopLeftPos().y - trans.GetBotRightPos().y));
        let overlap = new Transform();
        overlap.SetPos(overLapPos);
        overlap.SetSize(overlapSize);
        return overlap;
    }

    ApplyOverlapPush(overlap:Transform){
        if(overlap.size.x < overlap.size.y){
            if(overlap.pos.x > this.pos.x){
                this.pos.x -= overlap.size.x;
            }
            else{
                this.pos.x += overlap.size.x;
            }
        }
        else{
            if(overlap.pos.y > this.pos.y){
                this.pos.y -= overlap.size.y;
            }
            else{
                this.pos.y += overlap.size.y;
            }
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

    CheckWorldWrap(){
        if(this.pos.x > World.inst.GetHorizontalUnits()) this.pos.x = -this.size.x;
        if(this.pos.x < -this.size.x) this.pos.x = World.inst.GetHorizontalUnits();
        if(this.pos.y > World.inst.GetVerticalUnits()) this.pos.y = -this.size.y;
        if(this.pos.y < -this.size.y) this.pos.y = World.inst.GetVerticalUnits();
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

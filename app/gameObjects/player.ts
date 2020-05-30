import { Transform, DirEnum, Color, IMove, Vector  } from "./transform"
import { World } from "../main/world";

export enum PlayerState{
    Alive=0,
    Stunned=1,
    Dead=2
}

export class Player extends Transform implements IMove{

    public color:Color = Color.Random();
    public dir:DirEnum = DirEnum.None;
    public speed:number = 1;
    public hpMax:number = 11;
    public level:number = 1;
    public hp:number = this.hpMax;
    public state:PlayerState = PlayerState.Alive;
    public previousPos:Vector = new Vector();
    public deadCallback:any ;

    constructor(public id:number, deadCallback:any){
        super(0,0, 30, 30);
        this.deadCallback = deadCallback;
    }

    TakeDamage(damage:number):boolean{
        if(this.state == PlayerState.Alive){
            this.hp -= damage;
            if(this.hp <= 0 ){
                this.state = PlayerState.Dead;
                this.deadCallback(this.id, {
                    pos: this.GetTopLeftPos(),
                    color: Color.Red,
                    sizeX:this.sizeX,
                    sizeY:this.sizeY
                })
                return true;
            }
        }
        return false;
    }

    AddHp(hp:number){
        if(this.state != PlayerState.Dead){
            this.hp += hp;
            if(this.hp > this.hpMax){
                this.hp = this.hpMax;
            }
        }
        
    }

    LevelUp(){
        this.level++;
        this.hpMax++;
        this.hp++;
        this.sizeX += 5;
        this.sizeY += 5;
    }

    SetDirection(dir:DirEnum){
        this.dir = dir;
    }

    RevertPositionUpdate(){
        this.pos.x = this.previousPos.x;
        this.pos.y = this.previousPos.y;
    }

    UpdatePosition(dt:number){
        if(this.state != PlayerState.Alive) return;

        this.previousPos.x = this.pos.x;
        this.previousPos.y = this.pos.y;
        switch(this.dir){
            case(DirEnum.UpLeft):
                this.pos.add( Vector.ScaleBy(Vector.UpLeft, this.speed * dt) );
                break;
            case(DirEnum.UpRight):
                this.pos.add( Vector.ScaleBy(Vector.UpRight, this.speed * dt) );
                break;
            case DirEnum.Up:
                this.pos.y -= this.speed * dt;
                break;
            case(DirEnum.DownLeft):
                this.pos.add( Vector.ScaleBy(Vector.DownLeft, this.speed * dt) );
                break;
            case(DirEnum.DownRight):
                this.pos.add( Vector.ScaleBy(Vector.DownRight, this.speed * dt) );
                break;
            case DirEnum.Down:
                this.pos.y += this.speed * dt;
                break;
            case DirEnum.Left:
                this.pos.x -= this.speed * dt;
                break;
            case DirEnum.Right:
                this.pos.x += this.speed * dt;
                break;
        }

    }

    static PLAYER_LIST: Record<number, Player> = {};
    static AddPlayer(player:Player){ Player.PLAYER_LIST[player.id] = player; }
    static DeletePlayer(id:number){delete Player.PLAYER_LIST[id];}
    static GetPlayerById(id:number){return Player.PLAYER_LIST[id];}
    static GetPlayers(){return Player.PLAYER_LIST;}

    static UpdatePlayers(dt:number, pack:object[]){

        for(let i in Player.PLAYER_LIST){
            let player = Player.PLAYER_LIST[i];
            player.UpdatePosition(dt);
            player.CheckWorldWrap();

            // check collision against rocks
            //console.log(World.inst.GetIndex(player.pos));
            //console.log(player.pos);
            let cells = World.inst.GetPossibleCollisions(player.pos);
            //console.log(cells.length);
            for(let cell of cells){
                /*pack.push({
                    pos: cell.GetTopLeftPos(),
                    color: Color.Blue,
                    sizeX:cell.sizeX,
                    sizeY:cell.sizeY
                });*/
                if(cell.IsRock() && player.CheckCollision(cell)==true){
                    let overlap = player.GetOverlap(cell);
                    
                    /*pack.push({
                        pos: overlap.GetTopLeftPos(),
                        color: Color.Green,
                        sizeX:overlap.sizeX,
                        sizeY:overlap.sizeY
                    });*/
                    player.ApplyOverlapPush(overlap);
                }
            }
        }

        let toRevertPos:Player[] = [];
        for(let i in Player.PLAYER_LIST){
            let player = Player.PLAYER_LIST[i];

            for(let j in Player.PLAYER_LIST){
                let player2 = Player.PLAYER_LIST[j];
                if(i!=j && player.CheckCollision(player2)==true){
                    player.TakeDamage(player.hp);
                    continue;
                }
            }
            
            pack.push({
                pos: player.GetTopLeftPos(),
                color: Color.Red,
                sizeX:player.sizeX,
                sizeY:player.sizeY,
                id:-1
            });

            let topPos = player.GetTopLeftPos();
            let offsetY = player.sizeY * (player.hp/player.hpMax);
            topPos.y += player.sizeY - offsetY;
            pack.push({
                pos: topPos,
                color: player.color,
                sizeX:player.sizeX,
                sizeY:offsetY,
                id:-1
            });
        }
    }
    
}

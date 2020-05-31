import { Transform, DirEnum, Color, IMove, Vector, UnitType  } from "./transform"
import { World } from "../main/world";

export enum PlayerState{
    Alive=0,
    Stunned=1,
    Dead=2
}

export class Player extends Transform implements IMove, IPlayerSubject{

    public hpMax:number = 11;
    public level:number = 1;
    public hp:number = this.hpMax;
    public state:PlayerState = PlayerState.Alive;
    public previousPos:Vector = new Vector();
    public deadCallback:any ;

    constructor(id:number, deadCallback:any){
        super();
        this.size.x = 30;
        this.size.y = 30;
        this.id = id;
        this.deadCallback = deadCallback;
        this.SetColor( Color.Random() );
        this.type = UnitType.Player;
    }

    // from IMove
    public dir:DirEnum = DirEnum.None;
    public speed:number = 1;

    // from IPlayerSubject
    bullets:any[] = [];
    AddBullet(bullet:any):void{
        this.bullets.push(bullet);
    }
    RemoveBullet(bullet:any):void{
        let i = this.bullets.indexOf(bullet);
        delete this.bullets[i];
        this.bullets.splice(i,1);
    }

    RemovePlayer():void{
        for(let bullet of this.bullets){
            bullet.RemovePlayer();
        }
        let id = this.GetId();
        let dPack = this.GetDataPack();
        dPack.SetColor(Color.Red);
        this.deadCallback(id, dPack);
        Player.DeletePlayer(id);
    }

    

    TakeDamage(damage:number):boolean{
        if(this.state == PlayerState.Alive){
            this.hp -= damage;
            if(this.hp <= 0 ){
                this.state = PlayerState.Dead;
                this.RemovePlayer();
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
        this.size.x += 5;
        this.size.y += 5;
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
    static AddPlayer(player:Player){ 
        Player.PLAYER_LIST[player.GetId()] = player; 
    }
    static DeletePlayer(id:number){
        delete Player.PLAYER_LIST[id];
    }
    static GetPlayerById(id:number):Player|null
    {
        let player = Player.PLAYER_LIST[id];
        if(player !== undefined) return player;
        return null;
    }
    static GetPlayers():Record<number, Player>{return Player.PLAYER_LIST;}

    static UpdatePlayers(dt:number, pack:object[]){

        for(let i in Player.PLAYER_LIST){
            let player = Player.PLAYER_LIST[i];
            player.UpdatePosition(dt);
            player.CheckWorldWrap();

            // check collision against rocks
            let cells = World.inst.GetPossibleCollisions(player.pos);
            //console.log(cells.length);
            for(let cell of cells){
                //pack.push(cell.GetDataPack());
                if(cell.IsRock() && player.CheckCollision(cell)==true){
                    let overlap = player.GetOverlap(cell);
                    // pack.push(overlap.GetDataPack);
                    player.ApplyOverlapPush(overlap);
                }
            }
        }

        let deadPlayers:Player[] = [];

        for(let i in Player.PLAYER_LIST){
            let player = Player.PLAYER_LIST[i];

            for(let j in Player.PLAYER_LIST){
                let player2 = Player.PLAYER_LIST[j];
                if(i!=j && player.CheckCollision(player2)==true){
                    deadPlayers.push(player);
                    continue;
                }
            }

            // back red square
            let playerRedPack = player.GetDataPack();
            playerRedPack.SetColor(Color.Red);
            pack.push(playerRedPack);
            // main player square that shrinks as hp lowers
            let playerPack = player.GetDataPack();
            playerPack.sy = player.size.y * (player.hp/player.hpMax);
            playerPack.y += player.size.y - playerPack.sy;
            pack.push(playerPack);
        }

        for(let deadPlayer of deadPlayers){
            deadPlayer.TakeDamage(deadPlayer.hp);
        }
    }
    
}

export interface IPlayerSubject{
    bullets:any[];
    AddBullet(bullet:any):void;
    RemoveBullet(bullet:any):void;
    RemovePlayer():void;
}

export interface IPlayerObserver{
    player:Player;
    GetPlayer():Player | null;
    RemovePlayer():void;
    RemoveBullet():void;
}

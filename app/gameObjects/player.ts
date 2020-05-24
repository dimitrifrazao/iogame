
import { Transform, DirEnum, Color, IMove, Vector } from './transform';

export enum PlayerState{
    Alive=0,
    Stunned=1,
    Dead=2
}

export class Player extends Transform implements IMove{

    color:Color = Color.Random();
    public dir:DirEnum = DirEnum.None;
    public speed:number = 3;
    public bullets:number = 10;
    public hp = 10;
    public state:PlayerState = PlayerState.Alive;
    public previousPos:Vector = new Vector();

    constructor(public id:number){
        super(0,0, 30, 30);
    }

    TakeDamage(damage:number){
        if(this.state == PlayerState.Alive){
            this.hp -= damage;
            if(this.hp <= 0 ){
                this.state = PlayerState.Dead;
                this.color = Color.Red;
            }
        }
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

        if(this.pos.x > 1000) this.pos.x = -30;
        if(this.pos.x < -30) this.pos.x = 1000;
        if(this.pos.y > 500) this.pos.y = -30;
        if(this.pos.y < -30) this.pos.y = 500;
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
                color: player.color,
                size:player.sizeX
            });
        }
    }
    
}

import { Transform, UnitType  } from "./transform"
import { Vector } from "./vector"
import { Color } from "./color"
import { DirEnum, IMove} from "./interfaces/imove"
import { IBulletManager, IBulletObserver, IPlayer } from "./interfaces/ishoot"
import { World } from "../main/world";

export enum PlayerplayerState{
    Alive=0,
    Stunned=1,
    Dead=2
}

export enum WeaponType{
    default=0,
    shotgun=1,
    drop=2,
    knife=3
}

export class Player extends Transform implements IPlayer, IMove, IBulletManager{

    public name:string;
    public hpMax:number = 11;
    public level:number = 1;
    public hp:number = this.hpMax;
    public playerState:PlayerplayerState = PlayerplayerState.Alive;
    public previousPos:Vector = new Vector();
    public deadCallback:any;
    private weaponType: WeaponType = WeaponType.default;

    constructor(id:number, name:string, deadCallback:any){
        super();
        this.size.x = 30;
        this.size.y = 30;
        this.id = id;
        this.deadCallback = deadCallback;
        this.SetColor( Color.Random() );
        this.type = UnitType.Player;
        this.name = name;
    }

    // from IMove
    dir:DirEnum = DirEnum.None;
    speed:number = 1;
    push:Vector = new Vector();
    Push(obj:IMove){};

    SetWeaponType(weaponType:WeaponType){this.weaponType=weaponType;};
    GetWeaponType(){return this.weaponType;};
    GetWeaponData():any{
        switch(this.weaponType){
            case WeaponType.default: return {damage:1, speed:2, size:10, timer:-1};
            case WeaponType.shotgun: return {damage:3, speed:1, size:20, timer:-1};
            case WeaponType.drop: return {damage:5, speed:0, size:5, timer:-1};
            case WeaponType.knife: return {damage:10, speed:1, size:10, timer:10};
        }
    }

    // from IBulletManager
    bullets:IBulletObserver[] = [];
    AddBullet(bullet:IBulletObserver):void{
        this.bullets.push(bullet);
    }
    RemoveBullet(bullet:IBulletObserver):void{
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

    LevelUp(){
        this.level++;
        this.hpMax++;
        this.hp++;
        this.size.x += 5;
        this.size.y += 5;
    }

    AddHp(hp:number){
        if(this.playerState != PlayerplayerState.Dead){
            this.hp += hp;
            if(this.hp > this.hpMax){
                this.hp = this.hpMax;
            }
        }
        
    }

    

    // from IPlayer
    GetId():number{return this.id};

    TakeDamage(damage:number):void{
        if(this.playerState == PlayerplayerState.Alive){
            this.hp -= damage;
            if(this.hp <= 0 ){
                this.playerState = PlayerplayerState.Dead;
                this.RemovePlayer();
            }
        }
    }

    IsAlive(){return this.playerState !== PlayerplayerState.Dead};

    GetTransform():Transform{return this;};

    // player default 
    

    GetDataPack(){
        let dPack = super.GetDataPack();
        dPack.name = this.name;
        return dPack;
    }

    SetDirection(dir:DirEnum){
        this.dir = dir;
    }

    RevertPositionUpdate(){
        this.pos.x = this.previousPos.x;
        this.pos.y = this.previousPos.y;
    }

    UpdatePosition(dt:number){
        if(this.playerState != PlayerplayerState.Alive) return;

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
        /*if(this.push.len() > 0.001){
            if(this.push.len() > 10){
                this.push.normalize();
                this.push.scaleBy(10);
            }
            this.pos.x += this.push.x * dt;
            this.pos.y += this.push.y * dt;
            this.push = Vector.Lerp(this.push, Vector.Zero, dt);
        }
        */
        

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
    static GetIPlayers():Record<number, IPlayer>{return Player.PLAYER_LIST;}

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
                if(cell !== undefined &&  cell.IsRock() && player.CheckCollision(cell)==true){
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
            playerPack.name = ""; // erase name so we dont have doubles
            playerPack.sy = player.size.y * (player.hp/player.hpMax);
            playerPack.y += player.size.y - playerPack.sy;
            pack.push(playerPack);
        }

        for(let deadPlayer of deadPlayers){
            deadPlayer.TakeDamage(deadPlayer.hp);
        }
    }
    
}



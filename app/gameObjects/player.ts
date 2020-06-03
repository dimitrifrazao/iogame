import { Transform, UnitType  } from "./transform"
import { Vector } from "./vector"
import { Color } from "./color"
import { DirEnum, IMove} from "./interfaces/imove"
import { IBulletManager, IBulletObserver, IPlayer } from "./interfaces/ishoot"
import { World } from "../main/world";
import { BoundingBox } from "./boundingBox"

export enum PlayerState{
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
    public playerState:PlayerState = PlayerState.Alive;
    public deadCallback:any;
    private weaponType: WeaponType = WeaponType.default;
    private dashing = false;
    private dashBuffer = 0;
    private dashBufferMax = 100;

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
    GetMoveVector(){return Vector.Sub(this.pos, this.previousPos);};

    SetWeaponType(weaponType:WeaponType){this.weaponType=weaponType;};
    GetWeaponType(){return this.weaponType;};
    GetWeaponData():any{
        switch(this.weaponType){
            case WeaponType.default: return {damage:1, speed:2, size:10, timer:-1};
            case WeaponType.shotgun: return {damage:3, speed:1.7, size:15, timer:-1};
            case WeaponType.drop: return {damage:5, speed:1.4, size:20, timer:-1};
            case WeaponType.knife: return {damage:7, speed:1.1, size:25, timer:-1};
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
        if(this.playerState != PlayerState.Dead){
            this.hp += hp;
            if(this.hp > this.hpMax){
                this.hp = this.hpMax;
            }
        }
        
    }
    // from IPlayer
    GetId():number{return this.id};

    TakeDamage(damage:number):void{
        if(this.playerState == PlayerState.Alive){
            this.hp -= damage;
            if(this.hp <= 0 ){
                this.playerState = PlayerState.Dead;
                this.RemovePlayer();
            }
        }
    }

    IsAlive(){return this.playerState !== PlayerState.Dead};

    GetTransform():Transform{return this;};

    // player default 
    
    SetPlayerState(state:PlayerState){this.playerState=state;};

    SetDash(state:boolean){
        if(state && this.dashBuffer >= this.dashBufferMax) this.dashing = true;
        else if(state==false) this.dashing = false;
    }
    IsDashing(){return this.dashing;};

    GetDataPack(){
        let dPack = super.GetDataPack();
        dPack.name = this.name;
        return dPack;
    }

    SetDirection(dir:DirEnum){
        this.dir = dir;
    }

    UpdatePosition(dt:number){
        if(this.playerState != PlayerState.Alive) return;

        this.SetPreviousPos(this.GetPos());

        let speed = this.speed;
        if(this.dashing){
            speed = 2;
            this.dashBuffer -= dt * 0.5;
            if(this.dashBuffer < 0){
                this.dashBuffer = 0;
                this.dashing = false;
                speed = this.speed;
            }
            
        }
        else{
            this.dashBuffer += dt * 0.05;
            if(this.dashBuffer >= this.dashBufferMax){
                this.dashBuffer = this.dashBufferMax;
            }
        }

        switch(this.dir){
            case(DirEnum.UpLeft):
                this.pos.add( Vector.ScaleBy(Vector.UpLeft, speed* dt) );
                break;
            case(DirEnum.UpRight):
                this.pos.add( Vector.ScaleBy(Vector.UpRight, speed* dt) );
                break;
            case DirEnum.Up:
                this.pos.y -= speed* dt;
                break;
            case(DirEnum.DownLeft):
                this.pos.add( Vector.ScaleBy(Vector.DownLeft, speed* dt) );
                break;
            case(DirEnum.DownRight):
                this.pos.add( Vector.ScaleBy(Vector.DownRight, speed* dt) );
                break;
            case DirEnum.Down:
                this.pos.y += speed* dt;
                break;
            case DirEnum.Left:
                this.pos.x -= speed* dt;
                break;
            case DirEnum.Right:
                this.pos.x += speed* dt;
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
                //let cpack = cell.GetDataPack();
                //cpack.SetColor(Color.Cyan);
                //pack.push(cpack);
                if(cell.IsRock() && player.CheckCollision(cell)==true){
                    let overlapBB = BoundingBox.Sub(player.GetBoundingBox(), cell.GetBoundingBox())
                    
       
                    if(overlapBB.GetSizeX() < overlapBB.GetSizeY()){
                        if(player.pos.x > cell.GetPos().x) player.pos.x += overlapBB.GetSizeX()
                        else player.pos.x -= overlapBB.GetSizeX()
                    }
                    else{
                        if(player.pos.y > cell.GetPos().y) player.pos.y += overlapBB.GetSizeY()
                        else player.pos.y -= overlapBB.GetSizeY()
                    }
                    
                    //let overlap = overlapBB.GetTransform();
                    //let oPack = overlap.GetDataPack();
                    //oPack.SetColor(Color.Magenta);
                    //pack.push(oPack);
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

            let bulletCounter = new Transform();
            bulletCounter.SetPos(new Vector(20 + (50* (player.dashBuffer/player.dashBufferMax)),20));
            bulletCounter.SetColor(Color.DarkGrey);
            if(player.dashBuffer>=player.dashBufferMax) bulletCounter.SetColor(Color.Grey);
            bulletCounter.SetSize(new Vector(100 * (player.dashBuffer/player.dashBufferMax), 20));
            let bulletCounterPack = bulletCounter.GetDataPack();
            bulletCounterPack.id = player.id;
            bulletCounterPack.type = 3;
            pack.push(bulletCounterPack);

            let square = new Transform()
            square.SetSize(new Vector(20,20));
            bulletCounter.SetColor(Color.DarkGrey);
            for(let si=0; si<4; si++){
                square.SetPos(new Vector(150 + (si*40), 20));
                let sPack = square.GetDataPack();
                sPack.id = player.id;
                sPack.type = 3;
                sPack.SetColor(Color.DarkGrey);
                if(si == player.weaponType) sPack.SetColor(Color.Grey);
                pack.push(sPack);
            }
        }

        for(let deadPlayer of deadPlayers){
            deadPlayer.TakeDamage(deadPlayer.hp);
        }
    }
    
}



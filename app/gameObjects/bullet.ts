
import { Transform, UnitType  } from "./transform"
import { Vector } from "./vector"
import {World} from "../main/world"
import {DirEnum, IMove} from "./interfaces/imove"
import { IBulletManager, IBulletObserver, IPlayer } from "./interfaces/ishoot"

type bulletMap = Record<number, Bullet>;

export class Bullet extends Transform implements IMove, IBulletObserver
{
    
    damage:number = 1;
    timer:number = -1;

    constructor(player:IBulletManager)
    {
        super();
        this.size.x = 10;
        this.size.y = 10;
        this.player = player;
        this.id = this.player.GetId();
        this.type = UnitType.Bullet;
    }

    //IMove
    dir:DirEnum = DirEnum.None;
    speed:number = 2;
    push:Vector = new Vector();
    Push(obj:IMove){
        let vec = Vector.GetDirVector(this.dir);
        vec.scaleBy(3);
        obj.push.add(vec);
    };

    // IPlayerObserver
    player:IBulletManager;

    GetPlayer(){
        if(this.player !== undefined) return this.player;
        return null;
    }
    RemovePlayer():void{
        delete this.player;
    }
    RemoveBullet():void{
        let player = this.GetPlayer();
        if(player != null) player.RemoveBullet(this);
    }

    // default

    SetDirection(dir:DirEnum){this.dir = dir;}
    GetDirection(){return this.dir;}
    SetSpeed(speed:number){this.speed=speed;}
    GetSpeed(){return this.speed;}
    GetId(){
        let player = this.GetPlayer();
        if(player !== null) return player.GetId();
        return -1;
    }

    UpdatePosition(dt:number)
    {
        switch(this.dir){
            case(DirEnum.Up):
                this.pos.y -= this.speed * dt;
                break;
            case(DirEnum.Down):
                this.pos.y += this.speed * dt;
                break;
            case(DirEnum.Left):
                this.pos.x -= this.speed * dt;
                break;
            case(DirEnum.Right):
                this.pos.x += this.speed * dt;
                break;
        }

    }

    static BulletList: Bullet[] = [];

    static AddBullet(bullet:Bullet){
        Bullet.BulletList.push(bullet);
    }
    static DeleteBullet(bullet:Bullet){
        let index = Bullet.BulletList.indexOf(bullet);
        delete Bullet.BulletList[index];
        Bullet.BulletList.splice(index, 1);
    }

    static GetBullets(){return Bullet.BulletList;}

    static UpdateBullets(dt:number, pack:object[], players:Record<number, IPlayer>){

        for(let bullet of Bullet.BulletList){
            bullet.UpdatePosition(dt);
            bullet.CheckWorldWrap();

            let cells = World.inst.GetPossibleCollisions(bullet.pos);
            //console.log(cells.length);
            for(let i in  cells){
                let cell = cells[i];
                // FIX this, its bad
                //if(cell !== undefined ) console.log("DEAD CELL at " + i);
                if(cell !== undefined && cell.IsRock() && bullet.CheckCollision(cell)==true){
                    let overlap = bullet.GetOverlap(cell);
                    bullet.ApplyOverlapPush(overlap);
                    bullet.dir = Bullet.GetMirrorDir(bullet.dir);
                }
            }

            pack.push(bullet.GetDataPack()); 
        }

        let deletedBullets:Bullet[] = []

        for(let bullet of Bullet.BulletList){
            let deleteBullet:boolean = false;
            for(let bullet2 of Bullet.BulletList)
            {
                if(bullet !== bullet2 && bullet.CheckCollision(bullet2)===true){
                    deleteBullet = true;
                    continue;
                }
            }
            let bulletPlayer = bullet.GetPlayer();
            for(let i in players){
                let player = players[i];
                if(bullet.CheckCollision(player.GetTransform())===true){
                    if(bullet.id!= player.GetId()){
                        player.TakeDamage(bullet.damage);
                        if(!player.IsAlive() && bulletPlayer != null) bulletPlayer.LevelUp();
                    }
                    deleteBullet = true;
                    //bullet.Push(player);
                }
            }
            if(bullet.timer >= 0){
                console.log("timmer works")
                bullet.timer -= dt;
                if(bullet.timer <= 0) deleteBullet = true;
            }
            if(deleteBullet){
                deletedBullets.push(bullet);
                if(bulletPlayer != null) bullet.player.AddHp(bullet.damage);
            }             
        } 
        for(let bullet of deletedBullets){
            Bullet.DeleteBullet(bullet)
        }
    }

}
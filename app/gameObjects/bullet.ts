
import { Transform, DirEnum, World, IMove, UnitType  } from "./transform"
import { Player, IPlayerObserver } from "./player"


type bulletMap = Record<number, Bullet>;

export class Bullet extends Transform implements IMove, IPlayerObserver
{
    dir:DirEnum = DirEnum.None;
    speed:number = 2;
    damage:number = 1;
    timer:number = -1;

    // IPlayerObserver
    player:Player;
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

    constructor(player:Player)
    {
        super();
        this.size.x = 10;
        this.size.y = 10;
        this.player = player;
        this.type = UnitType.Bullet;
    }

    SetDirection(dir:DirEnum){this.dir = dir;}
    GetDirection(){return this.dir;}
    SetSpeed(speed:number){this.speed=speed;}
    GetSpeed(){return this.speed;}
    GetId(){
        let player = this.GetPlayer();
        if(player != null) return player.GetId();
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

    static UpdateBullets(dt:number, pack:object[]){
        let players:Record<number, Player> = Player.GetPlayers()

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
            let id = bullet.GetId();
            let bulletPlayer = bullet.GetPlayer();
            for(let i in players){
                let player = players[i];
                if(bullet.CheckCollision(player)===true){
                    if(id!= player.GetId()){
                        let killed = player.TakeDamage(bullet.damage);
                        if(killed && bulletPlayer != null){
                            bulletPlayer.LevelUp();
                        }
                        
                    }
                    deleteBullet = true;
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
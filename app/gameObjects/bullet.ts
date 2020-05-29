
import { Transform, DirEnum, World, IMove  } from "./transform"
import { Player } from "./player"


type bulletMap = Record<number, Bullet>;

export class Bullet extends Transform implements IMove
{
    owner:Player;
    dir:DirEnum = DirEnum.None;
    speed:number = 2;

    constructor(owner:Player, x:number, y:number)
    {
        super(x, y, 10, 10);
        this.owner = owner;
    }

    SetDirection(dir:DirEnum){this.dir = dir;}
    GetDirection(){return this.dir;}
    SetSpeed(speed:number){this.speed=speed;}
    GetSpeed(){return this.speed;}

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

    static UpdateBullets(dt:number, pack:object[], players:any){

        for(let bullet of Bullet.BulletList){
            bullet.UpdatePosition(dt);
            bullet.CheckWorldWrap();

            let cells = World.inst.GetPossibleCollisions(bullet.pos);
            //console.log(cells.length);
            for(let cell of cells){
                /*pack.push({
                    pos: cell.GetTopLeftPos(),
                    color: Color.Blue,
                    sizeX:cell.sizeX,
                    sizeY:cell.sizeY
                });*/
                if(cell.IsRock() && bullet.CheckCollision(cell)==true){
                    let overlap = bullet.GetOverlap(cell);
                    
                    /*pack.push({
                        pos: overlap.GetTopLeftPos(),
                        color: Color.Green,
                        sizeX:overlap.sizeX,
                        sizeY:overlap.sizeY
                    });*/
                    bullet.ApplyOverlapPush(overlap);
                    bullet.dir = Bullet.GetMirrorDir(bullet.dir);
                }
            }

            pack.push({
                pos: bullet.GetTopLeftPos(),
                color: bullet.owner.color,
                sizeX:bullet.sizeX,
                sizeY:bullet.sizeY,
                id:bullet.owner.id
            }); 
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
            for(let k in players){
                let player = players[k];
                if(bullet.CheckCollision(player)===true){
                    if(bullet.owner.id != player.id){
                        let killed = player.TakeDamage(1);
                        if(killed){
                            bullet.owner.LevelUp();
                        }
                        
                    }
                    deleteBullet = true;
                }
            }
            if(deleteBullet){
                deletedBullets.push(bullet);
                bullet.owner.AddHp(1);
            }             
        } 
        for(let bullet of deletedBullets){
            Bullet.DeleteBullet(bullet)
        }
    }

}
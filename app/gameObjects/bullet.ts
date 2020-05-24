
import { Transform, DirEnum, Color, IMove } from './transform';
import { Player } from "./player";

type bulletMap = Record<number, Bullet>;

export class Bullet extends Transform implements IMove
{
    owner:Player;
    dir:DirEnum = DirEnum.None;
    speed:number = 4;

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

        if(this.pos.x > 1000) this.pos.x = -this.sizeX;
        if(this.pos.x < -this.sizeX) this.pos.x = 1000;
        if(this.pos.y > 500) this.pos.y = -this.sizeY;
        if(this.pos.y < -this.sizeY) this.pos.y = 500;
    }

    static BulletList: Bullet[] = [];

    static AddBullet(bullet:Bullet){
        Bullet.BulletList.push(bullet);
    }

    static GetBullets(){return Bullet.BulletList;}

    static UpdateBullets(dt:number, pack:object[], players:any){

        for(let bullet of Bullet.BulletList){
            bullet.UpdatePosition(dt);

            pack.push({
                pos: bullet.GetTopLeftPos(),
                color: Color.Black,
                size:bullet.sizeX
            }); 
        }

        let updatedBullets:Bullet[] = []

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
                        player.TakeDamage(1);
                    }
                    deleteBullet = true;
                }
            }
            if(deleteBullet===false){
                updatedBullets.push(bullet);
            }     
            else{
                bullet.owner.bullets++;
            }             
        } 
        Bullet.BulletList = updatedBullets; 
    }

}

import { Transform, DirEnum, IMove } from './transform';

type bulletMap = Record<number, Bullet>;

export class Bullet extends Transform implements IMove
{
    dir:DirEnum = DirEnum.None;
    speed:number = 3;
    index:number = -1;
    owner: any;
    static BulletList: Bullet[] = [];

    constructor(x:number, y:number, owner:any)
    {
        super(x, y, 10, 10);
        this.owner = owner;
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

        if(this.pos.x > 1000) this.pos.x = -this.sizeX;
        if(this.pos.x < -this.sizeX) this.pos.x = 1000;
        if(this.pos.y > 500) this.pos.y = -this.sizeY;
        if(this.pos.y < -this.sizeY) this.pos.y = 500;
    }

    
    public static AddBullet( owner:any, dir:DirEnum){
        console.log("bullet added");
        let bullet = new Bullet(
            owner.pos.x , 
            owner.pos.y , 
            owner)

        bullet.dir = dir;
        bullet.index = Bullet.BulletList.length;
        Bullet.BulletList.push(bullet);
    }


    public static UpdateBullets(dt:number){
        for(let bullet of Bullet.BulletList){
            bullet.UpdatePosition(dt);
        }
    }

    public static GetBulletData(): object[]{
        let bData: object[] = [];
        for(let bullet of Bullet.BulletList){
            bData.push({
                x:bullet.pos.x,
                y:bullet.pos.y,
                r: 255,
                g: 100,
                b: 0,
                size:bullet.sizeX
            });
        }
        return bData;
    }


}
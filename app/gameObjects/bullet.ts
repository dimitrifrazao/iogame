
import { Transform, DirEnum } from './transform';

export class Bullet extends Transform
{
    dir:DirEnum = DirEnum.None;
    speed:number = 3;
    index:number = -1;
    owner: any;
    static BulletList:Bullet[] = [];

    constructor(x:number, y:number, size:number, owner:any)
    {
        super(x, y, size);
        this.owner = owner;
    }

    updatePosition()
    {
        switch(this.dir){
            case(DirEnum.Up):
                this.y -= this.speed;
                break;
            case(DirEnum.Down):
                this.y += this.speed;
                break;
            case(DirEnum.Left):
                this.x -= this.speed;
                break;
            case(DirEnum.Right):
                this.x += this.speed;
                break;
        }

        if(this.x > 1000) this.x = -this.size;
        if(this.x < -this.size) this.x = 1000;
        if(this.y > 500) this.y = -this.size;
        if(this.y < -this.size) this.y = 500;
    }

    
    public static AddBullet( owner:any, dir:DirEnum){
        console.log("bullet added");
        let bullet = new Bullet(
            owner.x , 
            owner.y , 
            10, 
            owner)
        bullet.index = Bullet.BulletList.length;
        bullet.dir = dir;
        Bullet.BulletList.push(bullet);
    }
    public static DeleteBullet(bullet: Bullet){
        bullet.owner.addBullet();
        let index = bullet.index;
        delete Bullet.BulletList[index];
        Bullet.BulletList.splice(index, 1);
    }

    public static UpdateBullets(){
        for(let bullet of Bullet.BulletList){
            bullet.updatePosition();
        }
    }

    public static GetBulletData(): object[]{
        let bData: object[] = [];
        for(let bullet of Bullet.BulletList){
            bData.push({
                x:bullet.x,
                y:bullet.y,
                r: 255,
                g: 100,
                b: 0,
                size:bullet.size
            });
        }
        return bData;
    }


}
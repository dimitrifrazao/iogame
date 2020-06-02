
import { Transform, UnitType  } from "./transform"
import { Vector } from "./vector"
import {World} from "../main/world"
import {DirEnum, IMove} from "./interfaces/imove"
import { IBulletManager, IBulletObserver, IPlayer } from "./interfaces/ishoot"
import { Color } from "./color"
import { BoundingBox } from "./boundingBox"

type bulletMap = Record<number, Bullet>;

export class Bullet extends Transform implements IMove, IBulletObserver
{
    
    damage:number = 1;
    timer:number = -1;
    isHP:Boolean = false;
    prevPos:Vector = new Vector();

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
    previousPos:Vector = new Vector();
    Push(obj:IMove){
        let vec = Vector.GetDirVector(this.dir);
        vec.scaleBy(3);
        obj.push.add(vec);
    };
    GetPreviousPos(){return this.previousPos;};
    GetMoveVector(){return Vector.Sub(this.previousPos, this.pos);};

    // IPlayerObserver
    player:IBulletManager;

    GetPlayer(){
        if(this.player !== undefined) return this.player;
        return null;
    }
    RemovePlayer():void{
        delete this.player;
        this.isHP = true;
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
        this.previousPos.x = this.pos.x;
        this.previousPos.y = this.pos.y;

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

        if(this.isHP===true && this.speed > 0){
            this.speed -= (dt * 0.01);
            this.color = Color.Lerp(this.color, Color.Red, (dt * 0.01));
            if(this.speed<0) this.speed = 0;
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

            let bb = bullet.GetBoundingBox();
            let bbOld = bullet.GetBoundingBox();

            bbOld.OffsetBy(Vector.ScaleBy(bullet.GetMoveVector(), -1));
            let fullBB = BoundingBox.Add(bb, bbOld);
            let bbTrans = fullBB.GetTransform();
            let tPack = bbTrans.GetDataPack();
            tPack.SetColor(Color.Green);
            //pack.push(tPack); 

            let cells = World.inst.GetPossibleCollisions(bullet.pos);
            //console.log(cells.length);
            for(let i in  cells){
                let cell = cells[i];
                // FIX this, its bad
                //if(cell !== undefined ) console.log("DEAD CELL at " + i);
                if(cell !== undefined && cell.IsRock() && bullet.CheckCollision(cell)==true){

                    let overlapBB = BoundingBox.Sub(fullBB, cell.GetBoundingBox())
                    let overlap = overlapBB.GetTransform();

                    let vec = Vector.ScaleBy( Vector.GetDirVector(bullet.dir), -1);
                    vec.mul(overlap.GetSize());
                    bullet.pos.add(vec);
             
                    /*if(overlapBB.GetSizeX() < overlapBB.GetSizeY()){
                        if(bullet.pos.x > cell.GetPos().x) bullet.pos.x += overlapBB.GetSizeX()
                        else bullet.pos.x -= overlapBB.GetSizeX()
                    }
                    else{
                        if(bullet.pos.y > cell.GetPos().y) bullet.pos.y += overlapBB.GetSizeY()
                        else bullet.pos.y -= overlapBB.GetSizeY()
                    }*/

                    bullet.dir = Bullet.GetMirrorDir(bullet.dir)
                    
                    let oPack = overlap.GetDataPack();
                    oPack.SetColor(Color.Magenta);
                    //pack.push(oPack);

                    /*let overlap = t.GetOverlap(cell);
                    pack.push(overlap.GetDataPack()); 
                    bullet.ApplyBulletOverlapPush(t, overlap);
                    bullet.dir = Bullet.GetMirrorDir(bullet.dir);
                    let overlap = bullet.GetOverlap(cell);
                    //bullet.ApplyOverlapPush(overlap);
                    let moveBack = Vector.ScaleBy(bullet.GetMoveVector(), -1);
                    let pushBack = moveBack.normal();
                    pushBack.x *= Math.min(moveBack.x, overlap.GetSize().x);
                    pushBack.y *= Math.min(moveBack.y, overlap.GetSize().y);
                    // pack.push(overlap.GetDataPack);
                    bullet.pos.add(pushBack);
                    bullet.dir = Bullet.GetMirrorDir(bullet.dir);*/
                
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
                        if(bullet.isHP===true){
                            player.AddHp(bullet.damage);
                        }
                        else{
                            player.TakeDamage(bullet.damage);
                            if(!player.IsAlive() && bulletPlayer != null) bulletPlayer.LevelUp();
                        }
                    }
                    deleteBullet = true;
                    //bullet.Push(player);
                }
            }
            if(bullet.timer >= 0){
                bullet.timer -= dt;
                if(bullet.timer <= 0) deleteBullet = true;
            }
            if(deleteBullet){
                deletedBullets.push(bullet);
                if(bulletPlayer != null) bullet.player.AddHp(bullet.damage);
            }             
        } 
        for(let bullet of deletedBullets){
            bullet.RemoveBullet();
            Bullet.DeleteBullet(bullet)
        }
    }

}
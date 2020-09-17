
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

    SetDamage(damage:number){
        this.damage = damage;
        if(damage > 0){
            let size = 7.5 + (damage * 2.5)
            this.size.x = size;
            this.size.y = size;

            this.speed = 2 - ((damage-1) * 0.1);
            if(this.speed<0) this.speed = 0;
        }
    };
    GetDamage(){return this.damage;};

    //IMove
    dir:DirEnum = DirEnum.None;
    speed:number = 2;
    push:Vector = new Vector();

    Push(obj:IMove){
        let vec = Vector.GetDirVector(this.dir);
        vec.scaleBy(3);
        obj.push.add(vec);
    };

    GetMoveVector(){return Vector.Sub(this.previousPos, this.pos);};

    // IPlayerObserver
    player:IBulletManager;

    GetPlayer(){
        if(this.player !== undefined) return this.player;
        return null;
    }
    RemovePlayer():void{
        //delete this.player;
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
        this.SetPreviousPos(this.GetPos());

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

            if(bullet.damage <= 0) continue;

            bullet.UpdatePosition(dt);
            bullet.CheckWorldWrap();

            let bbNow = bullet.GetBoundingBox();
            let bbOld = bullet.GetOldBoundingBox();

            //bbOld.OffsetBy(Vector.ScaleBy(bullet.GetMoveVector(), -1));
            let bbCombined = BoundingBox.Add(bbNow, bbOld);
            let bbTrans = bbCombined.GetTransform();

            if(false){ // render bb
                let tPack = bbTrans.GetDataPack();
                tPack.SetColor(Color.Green);
                tPack.id = -1;
                tPack.type = UnitType.Bullet;
                pack.push(tPack); 
            }
            

            let cells = World.inst.GetPossibleCollisions(bullet.pos);
            //console.log(cells.length);
            for(let i in  cells){
                let cell = cells[i];

                if(false){ // render cells
                    let cPack = cell.GetDataPack();
                    cPack.SetColor(new Color(0,0,0,0.1));
                    cPack.type = UnitType.Bullet;
                    pack.push(cPack);
                }
                

                if(cell.IsRock() && cell.CheckCollision(bbTrans)==true){
                    

                    let overlapBB = BoundingBox.Sub(bbCombined, cell.GetBoundingBox())
                    let overlap = overlapBB.GetTransform();

                    let vec = Vector.ScaleBy( Vector.GetDirVector(bullet.dir), -1.0001);
                    vec.mul(overlap.GetSize());
                    bullet.pos.add(vec);
             
                    if(false){ // render hiting cell
                        let cPack = cell.GetDataPack();
                        cPack.SetColor(Color.Magenta);
                        cPack.type = UnitType.Bullet;
                        pack.push(cPack);
                    }

                    bullet.dir = Bullet.GetMirrorDir(bullet.dir)
                    
                    if(false){ // render overlap
                        let oPack = overlap.GetDataPack();
                        oPack.SetColor(Color.Cyan);
                        pack.push(oPack);
                    }
                    
                    break;

                }
            }

            pack.push(bullet.GetDataPack()); 

            let bulletPlayer = bullet.GetPlayer();

            for(let i in players){
                let player = players[i];
                if(bullet.CheckCollision(player.GetTransform())===true){
                    if(bullet.id !== player.GetId()){
                        if(bullet.isHP===true){
                            player.AddHp(bullet.damage);
                        }
                        else{
                            player.TakeDamage(bullet.damage);
                            if(!player.IsAlive() && bulletPlayer != null) bulletPlayer.LevelUp();
                        }
                    }
                    if(bulletPlayer !== null) bulletPlayer.AddHp(bullet.damage);
                    bullet.damage = 0;
                    break;
                }
            }

            if(bullet.damage > 0){
                for(let bullet2 of Bullet.BulletList){
                    if(bullet !== bullet2 && bullet2.damage > 0){
                        bbCombined = BoundingBox.Add(bullet.GetBoundingBox(), bbOld);
                        bbTrans = bbCombined.GetTransform();
                        if(bbTrans.CheckCollision(bullet2)===true){
                            let damage1 = bullet.damage;
                            let damage2 = bullet2.damage;
                            if(bullet.id !== bullet2.id){
                                let bullet2Player = bullet2.GetPlayer();
                            
                                if(damage1 >= damage2){
                                    if(bullet2Player != null) bullet2Player.AddHp(damage2);
                                    bullet2.SetDamage(0);
                                }
                                else{
                                    if(bullet2Player != null) bullet2Player.AddHp(damage1);
                                    bullet2.SetDamage(damage2-damage1);
                                }
    
                                if(damage2 >= damage1){
                                    if(bulletPlayer != null) bulletPlayer.AddHp(damage1);
                                    bullet.SetDamage(0);
                                    break;
                                }
                                else{
                                    if(bulletPlayer != null) bulletPlayer.AddHp(damage2);
                                    bullet.SetDamage(damage1-damage2);
                                }
                            }
                            else{
                                if(damage1 >= damage2){
                                    bullet.SetDamage(damage1 + damage2);
                                    bullet2.SetDamage(0);
                                }
                                else{
                                    bullet.SetDamage(0);
                                    bullet2.SetDamage(damage1 + damage2);
                                }
                            }
                        }

                    }
                }
            }

            if(bullet.timer >= 0){
                bullet.timer -= dt;
                if(bullet.timer <= 0) bullet.damage = 0;
            }          
        } 

        for(let bullet of Bullet.BulletList){
            if(bullet.damage <= 0){
                bullet.RemoveBullet();
                Bullet.DeleteBullet(bullet)
            }
        }
    }

}
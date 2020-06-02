import { World} from "./world"
import { DirEnum} from "../gameObjects/interfaces/imove"
import { Vector } from "../gameObjects/vector"
import { Player } from "../gameObjects/player"
import { Bullet } from "../gameObjects/bullet"


export class Main{
    static inst:Main = new Main();
    private timeScale = 0.2;
    private dt:number = 0;

    constructor(){}

    Init(){
        World.inst.Build();
    }

    Tick(){
        let now = Date.now();
        this.dt = now - this.lastUpdate;
        this.lastUpdate = now;
    }

    SetDeltaTime(dt:number){this.dt=dt};
    GetDeltaTime(){return this.dt * this.timeScale};

    private lastUpdate = Date.now();

    AddPlayer(id:number, name:string, EmitDeadPlayer:any){
        var player = new Player(id, name, EmitDeadPlayer);
        player.SetPos( new Vector(Math.random() * 1000, Math.random() * 500) );
        Player.AddPlayer(player);
    };

    GetPlayerPosBy(id:number){return Player.GetPlayerById(id);};

    DeletePlayer(id:number){Player.DeletePlayer(id)};

    SetPlayerDir(id:number, dir:DirEnum){
        let player = Player.GetPlayerById(id);
        if(player != null) player.SetDirection(dir);
    }

    Shoot(id:number, dir:DirEnum){
        let player = Player.GetPlayerById(id);
        if(player != null){
            let hasHP = player.hp >= (1 + player.GetWeaponData().damage)
            let maxOverHP = (player.bullets.length <= (player.hpMax * 2))
            if(hasHP && maxOverHP){
                let pos = Vector.Copy(player.GetPos());
                let bullet = new Bullet(player);
                pos.add( Vector.ScaleBy( Vector.GetDirVector(dir), (player.GetSize().x/2)+(bullet.GetSize().x/2)) );
                bullet.SetPos(pos);
                bullet.SetDirection(dir);

                let damageData = player.GetWeaponData();
                bullet.damage = damageData.damage;
                bullet.speed = damageData.speed;
                bullet.timer = damageData.timer;
                bullet.SetSize( new Vector(damageData.size, damageData.size) );
                bullet.SetColor(player.GetColor());

                Bullet.AddBullet(bullet);
                player.AddBullet(bullet);
                player.TakeDamage(damageData.damage);
            }

        }
        
    }

    ChangeWeapon(id:number, type:number){
        let player = Player.GetPlayerById(id);
        if(player != null) player.SetWeaponType(type);
    }

    Update():object[]{
        let pack:object[] = []
        let dt = this.GetDeltaTime();
        Player.UpdatePlayers(dt, pack);
        Bullet.UpdateBullets(dt, pack, Player.GetIPlayers());
        return pack;
    }

}
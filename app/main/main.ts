import { DirEnum, Vector, World, Color} from "../gameObjects/transform"
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

    AddPlayer(id:number, EmitDeadPlayer:any){
        var player = new Player(id, EmitDeadPlayer);
        player.SetPos( new Vector(Math.random() * 1000, Math.random() * 500) );
        Player.AddPlayer(player);
    };

    DeletePlayer(id:number){Player.DeletePlayer(id)};

    SetPlayerDir(id:number, dir:DirEnum){
        let player = Player.GetPlayerById(id);
        if(player != null) player.SetDirection(dir);
    }

    Shoot(id:number, dir:DirEnum){
        let player = Player.GetPlayerById(id);
        if(player != null && player.hp >= 2){
            let pos = Vector.Copy(player.GetPos());
            let bullet = new Bullet(player);
            pos.add( Vector.ScaleBy( Vector.GetDirVector(dir), (player.GetSize().x/2)+(bullet.GetSize().y/2)) );
            bullet.SetPos(pos);
            bullet.SetDirection(dir);
            Bullet.AddBullet(bullet);
            player.TakeDamage(1);
        }
    }

    Update():object[]{
        let pack:object[] = []
        let dt = this.GetDeltaTime();
        Player.UpdatePlayers(dt, pack);
        Bullet.UpdateBullets(dt, pack);
        return pack;
    }

}
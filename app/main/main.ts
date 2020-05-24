import { World } from "./world"
import { Bullet } from '../gameObjects/bullet';
import { DirEnum, Color, Vector } from '../gameObjects/transform';
import { Player } from '../gameObjects/player';

export class Main{
    static inst:Main = new Main();
    private dt:number = 0;

    constructor(){}

    Tick(){
        let now = Date.now();
        this.dt = now - this.lastUpdate;
        this.lastUpdate = now;
    }

    SetDeltaTime(dt:number){this.dt=dt};
    GetDeltaTime(){return this.dt};

    private lastUpdate = Date.now();

    AddPlayer(id:number){
        var player = new Player(id);
        player.pos.x = Math.random() * 1000;
        player.pos.y = Math.random() * 500;
        Player.AddPlayer(player);
    };

    DeletePlayer(id:number){Player.DeletePlayer(id)};

    SetPlayerDir(id:number, dir:DirEnum){
        let player = Player.GetPlayerById(id);
        player.SetDirection(dir);
    }

    Shoot(id:number, dir:DirEnum){
        let player = Player.GetPlayerById(id);
        if(player.bullets > 0){
            let pos = Vector.Copy(player.pos);
            let bullet = new Bullet(player, pos.x ,pos.y);
            bullet.pos.add( Vector.ScaleBy( Vector.GetDirVector(dir), (player.sizeX/2)+(bullet.sizeX/2)) );
            bullet.SetDirection(dir);
            Bullet.AddBullet(bullet);
            player.bullets--;
        }
    }

    Update():object[]{
        let pack:object[] = []

        Player.UpdatePlayers(this.dt, pack);
        Bullet.UpdateBullets(this.dt, pack, Player.GetPlayers());

        return pack;
    }

}
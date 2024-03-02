import { World } from "./world";
import { DirEnum } from "../../shared/enums/playerInput";
import { Vector } from "../../shared/vector";
import { Player } from "../gameObjects/player";
import { Bullet } from "../gameObjects/bullet";
import { QuadtreeNode } from "../gameObjects/quadTree";
import { ClientRequestEnum } from "../../shared/enums/clientRequests";
import { Global } from "./global";
import { DataPack } from "../../shared/data";

export class Game {
  static inst: Game = new Game();
  private timeScale = 1.0;
  private dt: number = 0.0;
  private lastUpdate: number = Date.now();
  constructor() {}

  Init() {
    let h = 60;
    let v = 40;
    let s = 30;
    Global.unitSize = s;
    World.inst = new World(h, v, s);
    World.inst.Build();
    let center = World.inst.GetWorldCenter();
    let size = World.inst.GetWorldSize();
    QuadtreeNode.capacity = 1;
    QuadtreeNode.depthLimit = 4;
    QuadtreeNode.root = new QuadtreeNode(center, size);
  }

  Tick() {
    let now = Date.now();
    this.dt = now - this.lastUpdate;
    this.lastUpdate = now;
  }

  GetDeltaTime() {
    return this.dt * this.timeScale;
  }

  AddPlayer(id: number, name: string, EmitDeadPlayer: any) {
    var player = new Player(id, name, EmitDeadPlayer);
    // can spawn on rock?
    player.SetPos(
      new Vector(
        Math.random() * World.inst.GetHorizontalSize(),
        Math.random() * World.inst.GetVerticalSize()
      )
    );
  }

  DeletePlayer(id: number) {
    Player.DeletePlayer(id);
  }

  SetPlayerDir(id: number, dir: DirEnum) {
    let player = Player.GetPlayer(id);
    if (player != null) player.SetDirection(dir);
  }

  Shoot(id: number, dir: DirEnum) {
    let player = Player.GetPlayer(id);
    if (player != null) {
      let damageData = player.GetWeaponData();
      let hasHP = player.hp >= 1 + damageData.damage;
      let maxOverHP = player.bullets.keys.length <= player.hpMax * 2;
      if (hasHP && maxOverHP && !player.IsDashing()) {
        let pos = Vector.Copy(player.GetPos());

        let bullet = new Bullet(player);
        bullet.SetDamage(damageData.damage);
        bullet.speed = damageData.speed;
        //bullet.SetSize( new Vector(damageData.size, damageData.size) );
        bullet.SetColor(player.GetColor());

        pos.add(
          Vector.ScaleBy(
            Vector.GetDirVector(dir),
            player.GetSize().x / 2 + bullet.GetSize().x / 2
          )
        );
        bullet.SetPos(pos);
        bullet.SetDirection(dir);

        player.AddBullet(bullet);
        player.TakeDamage(damageData.damage);
      }
    }
  }

  Dash(id: number, dashState: boolean) {
    let player = Player.GetPlayer(id);
    if (player != null) player.SetDash(dashState);
  }

  ChangeWeapon(id: number, type: number) {
    let player = Player.GetPlayer(id);
    if (player != null) player.SetWeaponType(type);
  }

  ClientRequest(id: number, data: any) {
    switch (data.type) {
      case ClientRequestEnum.debugToggle:
        Global.debugToggle = !Global.debugToggle;
        break;
    }
  }

  Update(): DataPack[] {
    let pack: DataPack[] = [];
    let dt = this.GetDeltaTime();
    QuadtreeNode.root.Clear();
    Player.UpdatePlayers(dt, pack);
    Bullet.UpdateBullets(dt, pack);
    if (Global.debugToggle) {
      QuadtreeNode.root.AddDataPacks(pack); // draw quad tree
    }
    //pack.push({ dt: dt });
    return pack;
  }
}

import { Transform } from "./transform";
import { Vector } from "../../shared/vector";
import { CellType, World } from "../mainGame/world";
import { DirEnum } from "../../shared/enums/playerInput";
import { IBulletManager, IBulletObserver, IPlayer } from "./interfaces/ishoot";
import { Color } from "../../shared/color";
import { BoundingBox } from "../../shared/boundingBox";
import { QuadtreeNode } from "./quadTree";
import { Player } from "./player";
import { IMove } from "./interfaces/imove";
import { Global } from "../mainGame/global";
import { UnitType } from "../../shared/enums/unitType";

function generateBulletID(): number {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const randomFactor = Math.floor(Math.random() * 10000);
  return timestamp + randomFactor;
}

export class Bullet extends Transform implements IMove, IBulletObserver {
  static defaultSpeed: number = 0.4;
  static lowestSpeed: number = 0.000001;
  static slowDownSpeed: number = 0.01;

  damage: number = 1;
  prevPos: Vector = new Vector();
  //IMove
  dir: DirEnum = DirEnum.None;
  speed: number = Bullet.defaultSpeed;
  push: Vector = new Vector();

  constructor(public player: Player | null) {
    super();
    this.color = player !== null ? player.GetColor() : Color.Cyan;
    this.size.x = 10;
    this.size.y = 10;
    this.unitType = UnitType.Bullet;
    this.id = generateBulletID(); //this.player.GetId();
    let limit = 1000;
    while (limit >= 0) {
      if (!Bullet.BulletMap.has(this.id)) break;
      this.id = generateBulletID();
      limit -= 1;
    }
    if (limit == 0) throw Error("failed to generate bullet id");
    Bullet.BulletMap.set(this.id, this);
  }

  SetDamage(damage: number) {
    this.damage = damage;
    if (damage > 0 && this.player !== null && this.player.hpMax !== 0) {
      let size = (damage * 20) / 9 + 70 / 9;
      let lerp = damage / (this.player.hpMax - 1);
      this.size.x = size;
      this.size.y = size;
      this.speed = Bullet.lowestSpeed * lerp + Bullet.defaultSpeed * (1 - lerp);
    }
  }
  GetDamage() {
    return this.damage;
  }

  Push(obj: IMove) {
    let vec = Vector.GetDirVector(this.dir);
    vec.scaleBy(3);
    obj.push.add(vec);
  }

  GetMoveVector() {
    return Vector.Sub(this.previousPos, this.pos);
  }

  GetPlayer(): Player | null {
    return this.player;
  }

  // IPlayerObserver

  GetPlayerManager() {
    if (this.player !== null) return this.player as IBulletManager;
    return null;
  }

  Release(): void {
    let playerManager = this.GetPlayerManager();
    if (playerManager !== null) {
      playerManager.RemoveBullet(this);
    }
    this.player = null;
  }

  Shoot(dir: DirEnum) {
    if (this.player === null) return;
    this.SetDamage(this.player.GetWeaponDamage());
    let pos = this.player.GetPos();
    pos.add(
      Vector.ScaleBy(
        Vector.GetDirVector(dir),
        this.player.GetSize().x / 2 + this.GetSize().x / 2
      )
    );
    this.SetPos(pos);
    this.SetDirection(dir);
  }

  // default

  SetDirection(dir: DirEnum) {
    this.dir = dir;
  }
  GetDirection() {
    return this.dir;
  }
  SetSpeed(speed: number) {
    this.speed = speed;
  }
  GetSpeed() {
    return this.speed;
  }
  GetId() {
    return this.id;
  }

  UpdatePosition(dt: number) {
    this.SetPreviousPos(this.GetPos());

    switch (this.dir) {
      case DirEnum.Up:
        this.pos.y -= this.speed * dt;
        break;
      case DirEnum.Down:
        this.pos.y += this.speed * dt;
        break;
      case DirEnum.Left:
        this.pos.x -= this.speed * dt;
        break;
      case DirEnum.Right:
        this.pos.x += this.speed * dt;
        break;
    }

    if (this.player === null && this.speed > 0) {
      this.speed -= Bullet.slowDownSpeed;
      let lerp = Math.max(Math.min(1.0 - this.speed, 1.0), 0.0);
      this.color = Color.Lerp(this.color, Color.Red, lerp);
      if (this.speed < 0) this.speed = 0;
    }
  }

  static BulletMap = new Map<number, Bullet>();

  static DeleteBullet(bullet: Bullet) {
    bullet.Release();
    if (!Bullet.BulletMap.has(bullet.GetId())) {
      console.log("ERROR: tried to delete an non existing bullet id");
    }
    Bullet.BulletMap.delete(bullet.GetId());
  }

  static UpdateBullets(dt: number, pack: object[]) {
    Bullet.BulletMap.forEach((bullet, id) => {
      if (bullet.damage > 0) {
        bullet.UpdatePosition(dt);
        bullet.CheckWorldWrap();

        let bbCombined = bullet.GetCombinedBoundingBox();
        // check against rocks
        let dirFlipped = null;
        let cells = World.inst.GetPossibleCollisions(bullet.GetPos());
        for (let i = 0; i < cells.length; i++) {
          let cell = cells[i];
          if (
            cell.GetCellType() === CellType.Rock &&
            cell.CheckCollision(Transform.MakeFromBoundingBox(bbCombined)) ===
              true
          ) {
            if (Global.debugToggle) {
              let cpack = cell.GetDataPack();
              cpack.SetUnitType(UnitType.Bullet);
              cpack.SetColor(Color.Cyan);
              pack.push(cpack);
            }

            let overlapBB = BoundingBox.Sub(bbCombined, cell.GetBoundingBox());
            let overlap = Transform.MakeFromBoundingBox(overlapBB);

            let vec = Vector.ScaleBy(Vector.GetDirVector(bullet.dir), -1.0001);
            vec.mul(overlap.GetSize());
            bullet.pos.add(vec);
            if (dirFlipped === null) {
              dirFlipped = Bullet.GetMirrorDir(bullet.dir);
            }
          }
        }
        if (dirFlipped !== null) bullet.dir = dirFlipped;
      }

      QuadtreeNode.root.Insert(bullet);
      //pack.push(bullet.GetDataPack());
    });

    // compare to quadtree neighboors
    let toDeleteBullets = new Set<Bullet>();
    Bullet.BulletMap.forEach((bullet, id) => {
      if (bullet.GetDamage() === 0) {
        toDeleteBullets.add(bullet);
      } else {
        let bulletPlayer = bullet.GetPlayer();
        let bbCombined = bullet.GetCombinedBoundingBox();

        if (Global.debugToggle) {
          let dbugBB = bullet.GetBoundingBox();
          let p = Transform.MakeFromBoundingBox(bbCombined).GetDataPack();
          p.SetUnitType(UnitType.Bullet);
          p.SetColor(Color.DarkGrey);
          pack.push(p);
          p = Transform.MakeFromBoundingBox(dbugBB).GetDataPack();
          p.SetUnitType(UnitType.Bullet);
          p.SetColor(Color.Magenta);
          pack.push(p);
        } else {
          let dataPack =
            Transform.MakeFromBoundingBox(bbCombined).GetDataPack();
          dataPack.SetColor(bullet.GetColor());
          dataPack.SetUnitType(UnitType.Bullet);
          pack.push(dataPack);
        }

        let transforms = QuadtreeNode.root.Retrieve(bullet);
        // maybe wrap in a function and return when bulet hits?
        transforms.forEach((transform) => {
          if (transform.GetId() !== bullet.GetId() && bullet.GetDamage() > 0) {
            // is player collision
            if (transform.GetUnitType() === UnitType.Player) {
              let player = transform as Player;
              if (player.CheckCollision(bullet) && player.IsAlive()) {
                // same player
                if (
                  bulletPlayer !== null &&
                  player.GetId() === bulletPlayer.GetId()
                ) {
                  player.AddHp(bullet.GetDamage());
                  bullet.SetDamage(0);
                  toDeleteBullets.add(bullet);
                  //console.log("bullet touched own player");
                } else if (
                  bulletPlayer !== null &&
                  player.GetId() !== bulletPlayer.GetId()
                ) {
                  player.TakeDamage(bullet.GetDamage());
                  if (!player.IsAlive()) bulletPlayer.LevelUp();
                  bulletPlayer.AddHp(bullet.GetDamage());
                  //console.log("bullet touched other player");
                  bullet.SetDamage(0);
                  toDeleteBullets.add(bullet);
                } else if (bulletPlayer === null) {
                  //console.log("stray bullet touched other player");
                  player.AddHp(bullet.GetDamage());
                  bullet.SetDamage(0);
                  toDeleteBullets.add(bullet);
                } else {
                  console.log("hitting bullet to player collision edge case");
                }
              }

              // bullet collision
            } else if (transform.GetUnitType() === UnitType.Bullet) {
              let otherBullet = transform as Bullet;
              let tbbCombined = transform.GetCombinedBoundingBox();

              if (bbCombined.CheckCollision(tbbCombined)) {
                // other bullet hit!
                let bullet2Player = otherBullet.GetPlayer();
                let damage1 = bullet.GetDamage();
                let damage2 = otherBullet.GetDamage();

                // one or two are stray, combine!
                if (bulletPlayer === null && bullet2Player === null) {
                  if (damage1 > damage2) {
                    bullet.SetDamage(damage1 + damage2);
                    otherBullet.SetDamage(0);
                  } else {
                    otherBullet.SetDamage(damage1 + damage2);
                    bullet.SetDamage(0);
                    toDeleteBullets.add(bullet);
                  }
                } else if (bulletPlayer === null) {
                  otherBullet.SetDamage(damage1 + damage2);
                  bullet.SetDamage(0);
                  toDeleteBullets.add(bullet);
                } else if (bullet2Player === null) {
                  bullet.SetDamage(damage1 + damage2);
                  otherBullet.SetDamage(0);
                } else {
                  // both have players
                  if (bulletPlayer.GetId() !== bullet2Player.GetId()) {
                    if (damage1 > damage2) {
                      if (bullet2Player !== null) bullet2Player.AddHp(damage2);
                      if (bulletPlayer !== null) bulletPlayer.AddHp(damage2);
                      otherBullet.SetDamage(0);
                      bullet.SetDamage(damage1 - damage2);
                    } else if (damage1 < damage2) {
                      if (bullet2Player !== null) bullet2Player.AddHp(damage1);
                      if (bulletPlayer !== null) bulletPlayer.AddHp(damage1);
                      otherBullet.SetDamage(damage2 - damage1);
                      bullet.SetDamage(0);
                      toDeleteBullets.add(bullet);
                    } else {
                      if (bullet2Player !== null) bullet2Player.AddHp(damage2);
                      if (bulletPlayer !== null) bulletPlayer.AddHp(damage1);
                      otherBullet.SetDamage(0);
                      bullet.SetDamage(0);
                      toDeleteBullets.add(bullet);
                    }
                  } else {
                    // hitting same player bullet
                    if (damage1 > damage2) {
                      bullet.SetDamage(damage1 + damage2);
                      otherBullet.SetDamage(0);
                    } else {
                      otherBullet.SetDamage(damage1 + damage2);
                      bullet.SetDamage(0);
                      toDeleteBullets.add(bullet);
                      transforms.clear();
                    }
                  }
                }
              }
            } else {
              console.log("bullet hitting uknown type");
              console.log(transform);
            }
          }
        });
        transforms.clear();
      }
    });
    toDeleteBullets.forEach((toDeleteBullet) => {
      Bullet.DeleteBullet(toDeleteBullet);
    });
    toDeleteBullets.clear();
  }
}

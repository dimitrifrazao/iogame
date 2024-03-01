import { Transform, UnitType } from "./transform";
import { Vector } from "./vector";
import { CellType, World } from "../main/world";
import { DirEnum, IMove } from "./interfaces/imove";
import { IBulletManager, IBulletObserver, IPlayer } from "./interfaces/ishoot";
import { Color } from "./color";
import { BoundingBox } from "./boundingBox";
import { QuadtreeNode } from "./quadTree";
import { Player } from "./player";

function generateBulletID(): number {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const randomFactor = Math.floor(Math.random() * 10000);
  return timestamp + randomFactor;
}

export class Bullet extends Transform implements IMove, IBulletObserver {
  static defaultSpeed: number = 0.4;

  damage: number = 1;
  prevPos: Vector = new Vector();
  //IMove
  dir: DirEnum = DirEnum.None;
  speed: number = Bullet.defaultSpeed;
  push: Vector = new Vector();

  constructor(public player: Player | null) {
    super();
    this.size.x = 10;
    this.size.y = 10;
    this.type = UnitType.Bullet;
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
    if (damage > 0) {
      let size = 7.5 + damage * 2.5;
      this.size.x = size;
      this.size.y = size;
      this.speed = Math.max(Bullet.defaultSpeed - (damage - 1) * 0.1, 0.0);
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
      this.player = null;
    }
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
      this.speed -= dt * 0.01;
      this.color = Color.Lerp(this.color, Color.Red, dt * 0.01);
      if (this.speed < 0) this.speed = 0;
    }
  }

  static BulletMap = new Map<number, Bullet>();

  static DeleteBullet(bullet: Bullet) {
    bullet.Release();
    if (!Bullet.BulletMap.has(bullet.GetId())) {
      throw Error("tried to delete an non existing bullet id");
    }
    Bullet.BulletMap.delete(bullet.GetId());
  }

  static UpdateBullets(dt: number, pack: object[]) {
    Bullet.BulletMap.forEach((bullet, id) => {
      if (bullet.damage > 0) {
        bullet.UpdatePosition(dt);
        bullet.CheckWorldWrap();

        let bbCombined = bullet.GetCombinedBoundingBox();
        let p = bbCombined.GetDataPack();
        p.SetColor(Color.Blue);
        //pack.push(p);
        // check against rocks
        let dirFlipped = null;
        let cells = World.inst.GetPossibleCollisions(bullet.GetPos());
        for (let i = 0; i < cells.length; i++) {
          let cell = cells[i];
          if (
            cell.GetCellType() === CellType.Rock &&
            cell.CheckCollision(bbCombined.GetTransform()) === true
          ) {
            let cpack = cell.GetDataPack();
            cpack.SetColor(Color.Cyan);
            pack.push(cpack);

            let overlapBB = BoundingBox.Sub(bbCombined, cell.GetBoundingBox());
            let overlap = overlapBB.GetTransform();

            let vec = Vector.ScaleBy(Vector.GetDirVector(bullet.dir), -1.0001);
            vec.mul(overlap.GetSize());
            bullet.pos.add(vec);
            if (dirFlipped === null) {
              dirFlipped = Bullet.GetMirrorDir(bullet.dir);
            }

            //continue;
          }
        }
        if (dirFlipped !== null) bullet.dir = dirFlipped;
      }

      QuadtreeNode.root.Insert(bullet);
      pack.push(bullet.GetDataPack());
    });

    // compare to quadtree neighboors
    let toDeleteBullets: Bullet[] = [];
    Bullet.BulletMap.forEach((bullet, id) => {
      if (bullet.GetDamage() === 0) {
        toDeleteBullets.push(bullet);
      } else {
        let bulletPlayer = bullet.GetPlayer();
        let bbCombined = bullet.GetCombinedBoundingBox();
        let p = bbCombined.GetDataPack();
        p.SetColor(Color.Black);
        //pack.push(p);

        let transSet = new Set<number>();
        let transforms = QuadtreeNode.root.Retrieve(bullet);
        for (let i = 0; i < transforms.length; i++) {
          let transform = transforms[i];
          // skip if is same bullet
          if (transform.GetId() === bullet.GetId()) continue;
          // skip already visited
          if (transSet.has(transform.GetId())) continue;
          transSet.add(transform.GetId());

          // is player collision
          if (transform.GetUnitType() === UnitType.Player) {
            // skip if no overlap
            if (!transform.CheckCollision(bullet)) continue;

            let player = transform as Player;
            if (!player.IsAlive()) continue; // skip if dead

            if (
              bulletPlayer !== null &&
              player.GetId() === bulletPlayer.GetId()
            ) {
              player.AddHp(bullet.GetDamage());
              bullet.SetDamage(0);
              toDeleteBullets.push(bullet);
              //console.log("bullet touched own player");
              break;
            } else if (
              bulletPlayer !== null &&
              player.GetId() !== bulletPlayer.GetId()
            ) {
              player.TakeDamage(bullet.GetDamage());
              if (!player.IsAlive()) bulletPlayer.LevelUp();
              bulletPlayer.AddHp(bullet.GetDamage());
              //console.log("bullet touched other player");
              bullet.SetDamage(0);
              toDeleteBullets.push(bullet);
              break;
            } else if (bulletPlayer === null) {
              //console.log("stray bullet touched other player");
              player.AddHp(bullet.GetDamage());
              bullet.SetDamage(0);
              toDeleteBullets.push(bullet);
              break;
            } else {
              //console.log("hitting bullet to player collision edge case");
            }
            // bullet collision
          } else if (transform.GetUnitType() === UnitType.Bullet) {
            let otherBullet = transform as Bullet;
            // skip if zeroed
            if (otherBullet.GetDamage() === 0) continue;
            // skip when not colliding
            let tbbCombined = transform.GetCombinedBoundingBox();
            if (
              !bbCombined
                .GetTransform()
                .CheckCollision(tbbCombined.GetTransform())
            ) {
              continue;
            }

            // other bullet hit!
            let bullet2Player = otherBullet.GetPlayer();
            let damage1 = bullet.GetDamage();
            let damage2 = otherBullet.GetDamage();

            // one or two are stray, combine!
            if (bulletPlayer === null && bullet2Player === null) {
              otherBullet.SetDamage(damage1 + damage2);
              bullet.SetDamage(0);
              toDeleteBullets.push(bullet);
              break;
            } else if (bulletPlayer === null) {
              otherBullet.SetDamage(damage1 + damage2);
              bullet.SetDamage(0);
              toDeleteBullets.push(bullet);
              break;
            } else if (bullet2Player === null) {
              bullet.SetDamage(damage1 + damage2);
              bullet.SetDamage(0);
              toDeleteBullets.push(bullet);
              break;
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
                  toDeleteBullets.push(bullet);
                  break;
                } else {
                  if (bullet2Player !== null) bullet2Player.AddHp(damage2);
                  if (bulletPlayer !== null) bulletPlayer.AddHp(damage1);
                  otherBullet.SetDamage(0);
                  bullet.SetDamage(0);
                  toDeleteBullets.push(bullet);
                  break;
                }
              } else {
                // hitting same player bullet
                otherBullet.SetDamage(damage1 + damage2);
                bullet.SetDamage(0);
                toDeleteBullets.push(bullet);
                break;
              }
            }
          } else {
            console.log("bullet hitting uknown type");
            console.log(transform);
          }
        }
      }
    });
    for (let bullet of toDeleteBullets) {
      Bullet.DeleteBullet(bullet);
    }
  }
}

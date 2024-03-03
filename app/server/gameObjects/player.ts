import { Transform } from "./transform";
import { Vector } from "../../shared/vector";
import { Color } from "../../shared/color";
import { IMove } from "./interfaces/imove";
import { DirEnum } from "../../shared/enums/playerInput";
import { IBulletManager, IBulletObserver, IPlayer } from "./interfaces/ishoot";
import { CellType, World } from "../mainGame/world";
import { BoundingBox } from "../../shared/boundingBox";
import { QuadtreeNode } from "./quadTree";
import { WeaponType } from "../../shared/enums/weapons";
import { Global } from "../mainGame/global";
import { UnitType } from "../../shared/enums/unitType";
import { DataPack } from "../../shared/data";
import { GameData } from "../../shared/data";

export enum PlayerState {
  Alive = 0,
  Stunned = 1,
  Dead = 2,
}

export class Player
  extends Transform
  implements IPlayer, IMove, IBulletManager
{
  public name: string;
  public hpMax: number = 11;
  public level: number = 1;
  public hp: number = this.hpMax;
  public playerState: PlayerState = PlayerState.Alive;
  public deadCallback: any;
  private weaponType: WeaponType = WeaponType.default;
  private dashing = false;
  private dashBuffer = 0;
  private dashBufferMax = 100;
  static defaultSpeed: number = 0.3;

  private emitUpdate: boolean = false;

  private static startSize = 30;

  constructor(id: number, name: string, deadCallback: any) {
    super();
    this.size.x = 30;
    this.size.y = 30;
    this.id = id;
    this.deadCallback = deadCallback;
    this.SetColor(Color.PlayerRandomColor());
    this.unitType = UnitType.Player;
    this.name = name;
    Player.PlayerMap.set(id, this);
  }

  SetPlayerGameData(gameData: GameData) {
    if (this.emitUpdate) {
      gameData.data.push(this.hp);
      gameData.data.push(this.level);
      this.emitUpdate = false;
    }
    gameData.data.push(this.pos.y);
    gameData.data.push(this.pos.x);
  }

  // from IMove
  dir: DirEnum = DirEnum.None;
  speed: number = Player.defaultSpeed;
  push: Vector = new Vector();
  Push(obj: IMove) {}
  GetMoveVector(): Vector {
    return Vector.Sub(this.pos, this.previousPos);
  }

  SetWeaponType(weaponType: WeaponType): void {
    this.weaponType = weaponType;
    this.emitUpdate = true;
  }
  GetWeaponType(): WeaponType {
    return this.weaponType;
  }
  GetWeaponData(): number {
    switch (this.weaponType) {
      case WeaponType.default:
        return 1;
      case WeaponType.shotgun:
        return 3;
      case WeaponType.drop:
        return 5;
      case WeaponType.knife:
        return 7;
    }
  }

  GetWeaponDamage(): number {
    return this.GetWeaponData();
  }

  CanShoot(): boolean {
    let damage = this.GetWeaponDamage();
    let hasHP = this.hp >= 1 + damage;
    //let maxOverHP = this.bullets.keys.length <= this.hpMax * 2;
    return hasHP && !this.IsDashing();
  }

  // from IBulletManager
  bullets: Map<number, IBulletObserver> = new Map<number, IBulletObserver>();
  AddBullet(bullet: IBulletObserver, dir: DirEnum): void {
    this.bullets.set(bullet.GetId(), bullet);
    this.TakeDamage(this.GetWeaponDamage());
    bullet.Shoot(dir);
  }
  RemoveBullet(bullet: IBulletObserver): void {
    this.bullets.delete(bullet.GetId());
  }

  RemovePlayer(): void {
    console.log("Removing player: " + this.name);
    this.bullets.forEach((bullet, bulletId) => {
      bullet.Release();
    });
    this.bullets.clear();
    let id = this.GetId();
    let dPack = this.GetDataPack();
    dPack.SetColor(Color.EmptyPlayer);
    this.deadCallback(id, dPack);
    if (!Player.PlayerMap.has(id)) {
      console.log("ERROR: trying to delete a non existing Player id");
    }
    Player.PlayerMap.delete(id);
  }

  LevelUp(): void {
    this.level++;
    this.hpMax++;
    this.hp++;
    this.size.x += 5;
    this.size.y += 5;
    this.emitUpdate = true;
  }

  AddHp(hp: number): void {
    if (this.playerState != PlayerState.Dead) {
      this.hp += hp;
      if (this.hp > this.hpMax) {
        this.hp = this.hpMax;
      }
      this.emitUpdate = true;
    }
  }
  // from IPlayer
  GetId(): number {
    return this.id;
  }

  TakeDamage(damage: number): void {
    if (this.playerState == PlayerState.Alive) {
      this.hp -= damage;
      if (this.hp <= 0) {
        this.playerState = PlayerState.Dead;
        this.RemovePlayer();
      }
      this.emitUpdate = true;
    }
  }

  IsAlive(): boolean {
    return this.playerState !== PlayerState.Dead;
  }

  GetTransform(): Transform {
    return this;
  }

  // player default
  SetPlayerState(state: PlayerState): void {
    this.playerState = state;
    this.emitUpdate = true;
  }

  SetDash(state: boolean): void {
    if (state && this.dashBuffer >= this.dashBufferMax) {
      this.dashing = true;
    } else if (state === false) {
      this.dashing = false;
    }
  }
  IsDashing(): boolean {
    return this.dashing === true;
  }

  GetDataPack(): DataPack {
    let dPack = super.GetDataPack();
    dPack.name = this.name;
    return dPack;
  }

  SetDirection(dir: DirEnum): void {
    this.dir = dir;
  }

  UpdatePosition(dt: number): void {
    if (this.playerState != PlayerState.Alive) return;

    this.SetPreviousPos(this.GetPos());

    if (this.dashing) {
      if (this.dashBuffer > 0) {
        this.speed = 2 * Player.defaultSpeed;
        this.dashBuffer -= dt * 0.5;
        this.emitUpdate = true;
      } else {
        this.speed = Player.defaultSpeed;
        this.dashBuffer = 0;
        this.dashing = false;
        this.speed = Player.defaultSpeed;
      }
    } else {
      if (this.dashBuffer < this.dashBufferMax) {
        this.dashBuffer += dt * 0.05;
        this.emitUpdate = true;
      }
      if (this.dashBuffer >= this.dashBufferMax) {
        this.dashBuffer = this.dashBufferMax;
      }
    }

    switch (this.dir) {
      case DirEnum.UpLeft:
        this.pos.add(Vector.ScaleBy(Vector.UpLeft, this.speed * dt));
        break;
      case DirEnum.UpRight:
        this.pos.add(Vector.ScaleBy(Vector.UpRight, this.speed * dt));
        break;
      case DirEnum.Up:
        this.pos.y -= this.speed * dt;
        break;
      case DirEnum.DownLeft:
        this.pos.add(Vector.ScaleBy(Vector.DownLeft, this.speed * dt));
        break;
      case DirEnum.DownRight:
        this.pos.add(Vector.ScaleBy(Vector.DownRight, this.speed * dt));
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
  }

  private static PlayerMap: Map<number, Player> = new Map<number, Player>();

  static DeletePlayer(id: number): void {
    let player = Player.GetPlayer(id);
    if (player !== null) player.RemovePlayer();
  }
  static GetPlayer(id: number): Player | null {
    let player = Player.PlayerMap.get(id);
    if (player !== undefined) return player;
    return null;
  }

  static UpdatePlayers(dt: number, pack: object[]): void {
    Player.PlayerMap.forEach((player, id) => {
      player.UpdatePosition(dt);
      player.CheckWorldWrap();
      // check collision against rocks
      let cells = World.inst.GetPossibleCollisions(player.GetPos());
      for (let cell of cells) {
        if (
          cell.GetCellType() === CellType.Rock &&
          player.CheckCollision(cell) === true
        ) {
          let overlapBB = BoundingBox.Sub(
            player.GetBoundingBox(),
            cell.GetBoundingBox()
          );

          if (Global.debugToggle) {
            let cpack = cell.GetDataPack();
            cpack.SetUnitType(UnitType.Player);
            cpack.SetColor(Color.Cyan);
            pack.push(cpack);

            let op = Transform.MakeFromBoundingBox(overlapBB).GetDataPack();
            op.SetColor(Color.Orange);
            pack.push(op);
          }

          if (overlapBB.GetSizeX() < overlapBB.GetSizeY()) {
            if (player.pos.x > cell.GetPos().x)
              player.pos.x += overlapBB.GetSizeX();
            else player.pos.x -= overlapBB.GetSizeX();
          } else {
            if (player.pos.y > cell.GetPos().y)
              player.pos.y += overlapBB.GetSizeY();
            else player.pos.y -= overlapBB.GetSizeY();
          }
        }
      }
      QuadtreeNode.root.Insert(player);
    });

    let deadPlayers = new Set<Player>();

    Player.PlayerMap.forEach((player, id) => {
      let transforms = QuadtreeNode.root.Retrieve(player);
      transforms.forEach((transform) => {
        if (
          transform.GetUnitType() === UnitType.Player &&
          transform.GetId() !== player.id &&
          player.CheckCollision(transform)
        ) {
          deadPlayers.add(player);
        }
      });
      transforms.clear();

      // back red square
      let playerRedPack = player.GetDataPack();
      playerRedPack.SetColor(Color.EmptyPlayer);
      playerRedPack.id = -1;
      pack.push(playerRedPack);

      // main player square that shrinks as hp lowers
      let playerPack = player.GetDataPack();
      playerPack.name = ""; // erase name so we dont have double moving up n down
      playerPack.sy = player.size.y * (player.hp / player.hpMax);
      playerPack.y += playerPack.sx - playerPack.sy;
      pack.push(playerPack);
    });
    deadPlayers.forEach((deadPlayer) => {
      deadPlayer.TakeDamage(deadPlayer.hp);
    });
    deadPlayers.clear();
  }
}

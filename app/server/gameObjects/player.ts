import { Transform } from "./transform";
import { Vector } from "../../shared/vector";
import { Color } from "../../shared/color";
import { IMove } from "./interfaces/imove";
import { DirEnum } from "../../shared/enums/playerInput";
import { IBulletManager, IBulletObserver, IPlayer } from "./interfaces/ishoot";
import { CellType, World } from "../mainGame/world";
import { BoundingBox } from "./boundingBox";
import { QuadtreeNode } from "./quadTree";
import { WeaponType } from "../../shared/enums/weapons";
import { Global } from "../mainGame/global";
import { UnitType } from "../../shared/enums/unitType";

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
  private static startSize = 30;

  constructor(id: number, name: string, deadCallback: any) {
    super();
    this.size.x = 30;
    this.size.y = 30;
    this.id = id;
    this.deadCallback = deadCallback;
    this.SetColor(Color.PlayerRandomColor());
    this.type = UnitType.Player;
    this.name = name;
    Player.PlayerMap.set(id, this);
  }

  // from IMove
  dir: DirEnum = DirEnum.None;
  speed: number = Player.defaultSpeed;
  push: Vector = new Vector();
  Push(obj: IMove) {}
  GetMoveVector() {
    return Vector.Sub(this.pos, this.previousPos);
  }

  SetWeaponType(weaponType: WeaponType) {
    this.weaponType = weaponType;
  }
  GetWeaponType() {
    return this.weaponType;
  }
  GetWeaponData(): any {
    switch (this.weaponType) {
      case WeaponType.default:
        return { damage: 1, speed: 0.4, size: 10, timer: -1 };
      case WeaponType.shotgun:
        return { damage: 3, speed: 0.3, size: 15, timer: -1 };
      case WeaponType.drop:
        return { damage: 5, speed: 0.2, size: 20, timer: -1 };
      case WeaponType.knife:
        return { damage: 7, speed: 0.1, size: 25, timer: -1 };
    }
  }

  // from IBulletManager
  bullets: Map<number, IBulletObserver> = new Map<number, IBulletObserver>();
  AddBullet(bullet: IBulletObserver): void {
    this.bullets.set(bullet.GetId(), bullet);
  }
  RemoveBullet(bullet: IBulletObserver): void {
    this.bullets.delete(bullet.GetId());
  }

  RemovePlayer(): void {
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
    console.log("Removing player: " + this.name);
    Player.PlayerMap.delete(id);
  }

  LevelUp() {
    this.level++;
    this.hpMax++;
    this.hp++;
    this.size.x += 5;
    this.size.y += 5;
  }

  AddHp(hp: number) {
    if (this.playerState != PlayerState.Dead) {
      this.hp += hp;
      if (this.hp > this.hpMax) {
        this.hp = this.hpMax;
      }
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
    }
  }

  IsAlive() {
    return this.playerState !== PlayerState.Dead;
  }

  GetTransform(): Transform {
    return this;
  }

  // player default

  SetPlayerState(state: PlayerState) {
    this.playerState = state;
  }

  SetDash(state: boolean) {
    if (state && this.dashBuffer >= this.dashBufferMax) this.dashing = true;
    else if (state == false) this.dashing = false;
  }
  IsDashing() {
    return this.dashing;
  }

  GetDataPack() {
    let dPack = super.GetDataPack();
    dPack.name = this.name;
    return dPack;
  }

  SetDirection(dir: DirEnum) {
    this.dir = dir;
  }

  UpdatePosition(dt: number) {
    if (this.playerState != PlayerState.Alive) return;

    this.SetPreviousPos(this.GetPos());

    if (this.dashing) {
      this.speed = 2 * Player.defaultSpeed;
      this.dashBuffer -= dt * 0.5;
      if (this.dashBuffer < 0) {
        this.dashBuffer = 0;
        this.dashing = false;
        this.speed = Player.defaultSpeed;
      }
    } else {
      this.dashBuffer += dt * 0.05;
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

  static DeletePlayer(id: number) {
    let player = Player.GetPlayer(id);
    if (player !== null) player.RemovePlayer();
  }
  static GetPlayer(id: number): Player | null {
    let player = Player.PlayerMap.get(id);
    if (player !== undefined) return player;
    return null;
  }

  static UpdatePlayers(dt: number, pack: object[]) {
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
            cpack.SetColor(Color.Cyan);
            pack.push(cpack);

            let op = overlapBB.GetDataPack();
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

    let deadPlayers: Player[] = [];

    Player.PlayerMap.forEach((player, id) => {
      let transSet = new Set<Transform>();
      let transforms = QuadtreeNode.root.Retrieve(player);
      for (let i = 0; i < transforms.length; i++) {
        let transform = transforms[i];
        if (
          //!transSet.has(transform) &&
          transform.GetUnitType() === UnitType.Player &&
          transform.GetId() !== player.id &&
          player.CheckCollision(transform)
        ) {
          transSet.add(transform);
          deadPlayers.push(player);
          continue;
        }
      }
      transforms.length = 0;

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

      let dashUI = new Transform();
      dashUI.SetPosValues(70, 20);
      dashUI.SetSizeValues(100, 20);
      dashUI.SetColor(Color.DarkGrey);
      let pashPack = dashUI.GetDataPack();
      pashPack.id = player.id;
      pashPack.type = 3;
      pack.push(pashPack);

      dashUI.SetColor(Color.Grey);
      if (player.dashBuffer >= player.dashBufferMax)
        dashUI.SetColor(Color.LightGrey);
      dashUI.SetPosValues(
        25 + 45 * (player.dashBuffer / player.dashBufferMax),
        20
      );
      dashUI.SetSizeValues(90 * (player.dashBuffer / player.dashBufferMax), 10);

      pashPack = dashUI.GetDataPack();
      pashPack.id = player.id;
      pashPack.type = 3;
      pack.push(pashPack);

      let square = new Transform();
      for (let si = 0; si < 4; si++) {
        square.SetSizeValues(20, 20);
        square.SetColor(Color.DarkGrey);
        square.SetPosValues(150 + si * 40, 20);
        let sPack = square.GetDataPack();
        sPack.id = player.id;
        sPack.type = 3;
        pack.push(sPack);
        if (si == player.weaponType) {
          square.SetSizeValues(10, 10);
          square.SetColor(Color.DarkGrey);
          square.SetColor(Color.LightGrey);
          sPack = square.GetDataPack();
          sPack.id = player.id;
          sPack.type = 3;
          pack.push(sPack);
        }
      }
    });

    while (deadPlayers.length > 0) {
      let deadPlayer = deadPlayers.pop();
      if (deadPlayer !== undefined) deadPlayer.TakeDamage(deadPlayer.hp);
    }
  }
}

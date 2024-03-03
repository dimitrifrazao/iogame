import { Transform } from "../transform";
import { DirEnum } from "../../../shared/enums/playerInput";
/*
Interfaces between bullets & players
*/
export interface IBulletManager {
  bullets: Map<number, IBulletObserver>;
  AddBullet(bullet: IBulletObserver, dir: DirEnum): void;
  RemoveBullet(bullet: IBulletObserver): void;
}

export interface IBulletObserver {
  GetPlayerManager(): IBulletManager | null;
  Release(): void;
  GetId(): number;
  Shoot(dir: DirEnum): void;
}

export interface IPlayer {
  GetId(): number;
  TakeDamage(damage: number): void;
  IsAlive(): boolean;
  GetTransform(): Transform;
  AddHp(hp: number): void;
}

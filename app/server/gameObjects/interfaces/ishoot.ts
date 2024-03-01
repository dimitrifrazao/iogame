import { Transform } from "../transform";

/*
Interfaces between bullets & players
*/
export interface IBulletManager {
  bullets: Map<number, IBulletObserver>;
  AddBullet(bullet: IBulletObserver): void;
  RemoveBullet(bullet: IBulletObserver): void;
  //RemovePlayer(): void;
  //GetId(): number;
  //LevelUp(): void;
  //AddHp(hp: number): void;
}

export interface IBulletObserver {
  GetPlayerManager(): IBulletManager | null;
  Release(): void;
  GetId(): number;
}

export interface IPlayer {
  GetId(): number;
  TakeDamage(damage: number): void;
  IsAlive(): boolean;
  GetTransform(): Transform;
  AddHp(hp: number): void;
}

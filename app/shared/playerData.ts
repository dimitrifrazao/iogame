import { WeaponType } from "./enums/weapons";
import { Color } from "./color";

export class PlayerData {
  constructor(public hp: number, public size: number) {}
  public weaponType: WeaponType = WeaponType.default;
  public dashBarValue: number = 100;
  public color: Color = Color.PlayerRandom();
}

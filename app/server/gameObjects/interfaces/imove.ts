import { Vector } from "../../../shared/vector";

export interface IMove {
  speed: number;
  push: Vector;
  UpdatePosition(dt: number): void;
  Push(obj: IMove): void;
  GetMoveVector(): Vector;
}

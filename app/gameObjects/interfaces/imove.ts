import { Vector } from "../vector";

export interface IMove{
    dir: DirEnum;
    speed: number;
    push:Vector;
    UpdatePosition(dt:number):void;
    Push(obj:IMove):void;
}

export enum DirEnum {
    None=0,
    Up=1,
    Down=2,
    Left=3,
    Right=4,
    UpLeft=5,
    UpRight=6,
    DownLeft=7,
    DownRight=8
}
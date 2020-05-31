import { Transform } from "../transform";

/*
Interfaces between bullets & players
*/
export interface IBulletManager{
    bullets:IBulletObserver[];
    AddBullet(bullet:IBulletObserver):void;
    RemoveBullet(bullet:IBulletObserver):void;
    RemovePlayer():void;
    GetId():number;
    LevelUp():void;
    AddHp(hp:number):void;
}

export interface IBulletObserver{
    player:IBulletManager;
    GetPlayer():IBulletManager | null;
    RemovePlayer():void;
    RemoveBullet():void;
}

export interface IPlayer{
    GetId():number;
    TakeDamage(damage:number):void;
    IsAlive():boolean;
    GetTransform():Transform;

}
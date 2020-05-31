import {Vector} from "../gameObjects/vector"

export abstract class GameObject{
    private state:boolean = true;
    constructor(){}
    Init():void{}
    Update(dt:number):void{}
    SetUpdateTo(state:boolean):void{
        if(state !== this.state){
            if(state){
                GameObject.updatables.push(this);
            }
            else{
                let i = GameObject.updatables.indexOf(this);
                delete GameObject.updatables[i];
                GameObject.updatables.splice(i,1);
            }
            this.state = state;
        } 
    }

    static updatables:GameObject[] = [];
    static UpdateAll(dt:number):void{
        for(let gameObject of GameObject.updatables){
            gameObject.Update(dt);
        }
    }
}

export class BoundingBox{
    topLeft:Vector = new Vector();
    botRight:Vector = new Vector();
    constructor(){}
}

export interface IBoxCollider{
    bb:BoundingBox;
}

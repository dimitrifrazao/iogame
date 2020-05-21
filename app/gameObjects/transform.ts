export enum DirEnum {
    None=0,
    Up=1,
    Down=2,
    Left=3,
    Right=4
}

export class Transform {
    x: number;
    y: number;
    size: number;
    constructor(x:number=0, y:number=0, size:number=1){
        this.x=x;
        this.y=y;
        this.size = size;
    }
    checkCollision(trans:any):boolean{
        return (Math.abs((this.x + (this.size/2)) - (trans.x + (trans.size/2))) < (this.size + trans.size)/2 ) && 
        (Math.abs((this.y + (this.size/2)) - (trans.y + (trans.size/2))) < (this.size + trans.size)/2 )  ;
    }
}



/*module.exports = {
    DirEnum: DirEnum,
    Transform: Transform
};
*/
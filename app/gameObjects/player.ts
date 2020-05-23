
import { Transform, DirEnum, Color, IMove, Vector } from './transform';

export class Player extends Transform implements IMove{

    static PLAYER_LIST: Player[] = [];

    color:Color = Color.CreateRandom();
    public dir:DirEnum = DirEnum.None;
    public speed:number = 3;
    public bullets:number = 10;
    public previousPos:Vector = new Vector();

    constructor(public id:number){
        super(0,0, 30, 30);
    }

    static Remove(player:Player){
        delete Player.PLAYER_LIST[player.id];
    }

    SetDirection(dir:DirEnum){
        this.dir = dir;
    }

    RevertPositionUpdate(){
        this.pos.x = this.previousPos.x;
        this.pos.y = this.previousPos.y;
    }

    UpdatePosition(dt:number){
        this.previousPos.x = this.pos.x;
        this.previousPos.y = this.pos.y;
        switch(this.dir){
            case(DirEnum.UpLeft):
                this.pos.add( Vector.ScaleBy(Vector.UpLeft, this.speed * dt) );
                break;
            case(DirEnum.UpRight):
                this.pos.add( Vector.ScaleBy(Vector.UpRight, this.speed * dt) );
                break;
            case DirEnum.Up:
                this.pos.y -= this.speed * dt;
                break;
            case(DirEnum.DownLeft):
                this.pos.add( Vector.ScaleBy(Vector.DownLeft, this.speed * dt) );
                break;
            case(DirEnum.DownRight):
                this.pos.add( Vector.ScaleBy(Vector.DownRight, this.speed * dt) );
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

        if(this.pos.x > 1000) this.pos.x = -30;
        if(this.pos.x < -30) this.pos.x = 1000;
        if(this.pos.y > 500) this.pos.y = -30;
        if(this.pos.y < -30) this.pos.y = 500;
    }
}

/*

var Player = function(id: number){
    var self = {
        x: Math.random() * 1000,
        y: Math.random() * 500,
        speed:3,
        id:id,
        r : Math.random() * 255,
        g : Math.random() * 255,
        b : Math.random() * 255,
        dir:DirEnum.None,
        update: true,
        number : "" + Math.floor(10 * Math.random()),
        bullets:10,
        addBullet: function(){self.bullets++},
        removeBullet: function(){self.bullets--},

        setDirection: function(dir:DirEnum){
            self.dir = dir;
        },

        updatePosition: function(delta:number){
            if(self.update===true){

                switch(self.dir){
                    case(DirEnum.UpLeft):
                    case(DirEnum.UpRight):
                    case(DirEnum.Up):
                    self.y -= self.speed * delta;
                    break;
                    case(DirEnum.DownLeft):
                    case(DirEnum.DownRight):
                    case(DirEnum.Down):
                    self.y += self.speed * delta;
                    break;

                    case(DirEnum.Left):
                    self.x -= self.speed * delta;
                    break;
                    case(DirEnum.Right):
                    self.x += self.speed * delta;
                    break;
                }

                if(self.x > 1000) self.x = -30;
                if(self.x < -30) self.x = 1000;
                if(self.y > 500) self.y = -30;
                if(self.y < -30) self.y = 500;
            }
        },

        hasTouched: function(player : any) : boolean{
            return ( Math.abs(self.x - player.x) < 30) && ( Math.abs(self.y - player.y) < 30);
        }
    }
    return self;
}
*/

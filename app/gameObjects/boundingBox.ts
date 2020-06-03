import {Vector} from "./vector"
import { Transform } from "./transform";

export class BoundingBox{
    private topLeft:Vector = new Vector();
    private botRight:Vector = new Vector();
    constructor(){}

    GetTopLeft(){return this.topLeft;};
    GetBotRight(){return this.botRight;};
    GetSizeX():number{return Math.abs(this.botRight.x - this.topLeft.x);};
    GetSizeY():number{return Math.abs(this.botRight.y - this.topLeft.y);};
    GetSize():Vector{return new Vector(this.GetSizeX(), this.GetSizeY());};
    GetTransform():Transform{
        let t = new Transform();
        t.SetPos(Vector.GetInbetween(this.topLeft, this.botRight))
        t.SetSize(new Vector(this.GetSizeX(), this.GetSizeY()))
        return t;
    }
    OffsetBy(vec:Vector){
        this.topLeft.sub(vec);
        this.botRight.sub(vec);
    }

    static Add(bb1:BoundingBox, bb2:BoundingBox){
        let bb3 = new BoundingBox()
        bb3.topLeft.x = Math.min(bb1.topLeft.x, bb2.topLeft.x)
        bb3.topLeft.y = Math.min(bb1.topLeft.y, bb2.topLeft.y)
        bb3.botRight.x = Math.max(bb1.botRight.x, bb2.botRight.x)
        bb3.botRight.y = Math.max(bb1.botRight.y, bb2.botRight.y)
        return bb3;
    }

    static Sub(bb1:BoundingBox, bb2:BoundingBox){
        let bb3 = new BoundingBox()
        bb3.topLeft.x = Math.max(bb1.topLeft.x, bb2.topLeft.x)
        bb3.topLeft.y = Math.max(bb1.topLeft.y, bb2.topLeft.y)
        bb3.botRight.x = Math.min(bb1.botRight.x, bb2.botRight.x)
        bb3.botRight.y = Math.min(bb1.botRight.y, bb2.botRight.y)
        return bb3;
    }

    static MakeFrom(trans:Transform):BoundingBox{
        let bb = new BoundingBox();
        bb.topLeft = Vector.Copy(trans.GetPos());
        bb.botRight = Vector.Copy(trans.GetPos());
        bb.topLeft.sub(Vector.ScaleBy(trans.GetSize(), 0.5));
        bb.botRight.add(Vector.ScaleBy(trans.GetSize(), 0.5));
        return bb;
    }

    static MakeFromVectorAndSize(vec:Vector, size:Vector):BoundingBox{
        let bb = new BoundingBox();
        bb.topLeft = Vector.Copy(vec);
        bb.botRight = Vector.Copy(vec);
        bb.topLeft.sub(Vector.ScaleBy(size, 0.5));
        bb.botRight.add(Vector.ScaleBy(size, 0.5));
        return bb;
    }
}
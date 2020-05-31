export class Color{
    static maxValue:number = 255;
    static Black:Color = new Color(0,0,0);
    static Red:Color = new Color(255,0,0);
    static Green:Color = new Color(0,255,0);
    static Blue:Color = new Color(0,0,255);
    static Grey:Color = new Color(200,200,200);
    static DarkGrey:Color = new Color(50,50,50);

    constructor(public r:number=0, public g:number=0, public b:number=0, public a:number=1){}
    static Random(){
        return new Color(
            (Math.random() * 100) + 100, 
            (Math.random() * 100) + 100, 
            (Math.random() * 100) + 100
        )
    };
}
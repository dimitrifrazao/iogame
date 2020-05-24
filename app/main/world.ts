export class World{
    public static inst:World = new World(1000, 500);

    constructor(private hUnits:number, private vUnits:number){}
    
    GetHorizontalUnits(){return this.hUnits};
    GetVerticalUnits(){return this.vUnits};
    
}
import { generateObjectUUID } from "./utils/auth";

export default abstract class World{
    private static registry: Map<string, new () => World> = new Map();
    static register(tag: string, entity: new () => World){
        World.registry.set(tag, entity);
    }
    static create(tag: string):World {
        const sub = World.registry.get(tag);
        if(sub){
            return new sub();
        } else {
            throw new Error(`World with tag ${tag} not found`);
        }
    }

    abstract tag: string;
    abstract maxWave: number;
    abstract width: number;
    abstract height: number;
    abstract tiles: string[]; // tile assets url/path
    abstract tileMap: number[][]; // tileMap[y][x] = tileIndex of World.tiles
    abstract playerSpawn: IZone;
    abstract enemySpawn: IZone[];
    abstract waves: IWaveEnemy[][];
    abstract environment: IEnvironment[];
    
    private readonly _id: string = generateObjectUUID();
    constructor(){this.initialize()}
    private initialize() {
    }
    get id():string{return this._id};

    tick(delta: number){
        // do something
    }
}

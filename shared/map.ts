import { ObjectId } from "mongodb";

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

    abstract readonly tag: string;
    abstract readonly maxWave: number;
    abstract readonly width: number;
    abstract readonly height: number;
    abstract readonly spawnX: number;
    abstract readonly spawnY: number;
    abstract readonly waves: IWaveEnemy[][];
    abstract readonly environment: IEnvironment[];
    
    private readonly _id: string = new ObjectId().toHexString();
    constructor(){this.initialize()}
    private initialize() {
    }
    get id():string{return this._id};

    tick(delta: number){
        // do nothing
    }
}

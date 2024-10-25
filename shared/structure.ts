import { Sprite, Container } from "pixi.js";
import { generateObjectUUID } from "./utils/auth";

export default abstract class Structure{
    private static registry: Map<string, new () => Structure> = new Map();
    static register(tag: string, entity: new () => Structure){
        Structure.registry.set(tag, entity);
    }
    static create(tag: string):Structure {
        const sub = Structure.registry.get(tag);
        if(sub){
            return new sub();
        } else {
            throw new Error(`Structure with tag ${tag} not found`);
        }
    }

    abstract tag: string;
    abstract maxHealth: number;

    private readonly _id: string = generateObjectUUID();
    private _sprite: Sprite | Container | null = null;
    private _health: number = 0;
    constructor(){this.initialize()}
    private initialize() {
        this._health = this.maxHealth;
    }
    get id():string{return this._id};
    get health():number{return this._health};

    tick(delta: number){
        // do nothing
    }
}
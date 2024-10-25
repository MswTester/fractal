import { Container, Sprite } from "pixi.js";
import { generateObjectUUID } from "./utils/auth";

export default abstract class Entity{
    private static registry: Map<string, new (...args:any[]) => Entity> = new Map();
    static register(tag: string, entity: new (...args:any[]) => Entity){
        Entity.registry.set(tag, entity);
    }
    static create(tag: string):Entity {
        const sub = Entity.registry.get(tag);
        if(sub){
            return new sub();
        } else {
            throw new Error(`Entity with tag ${tag} not found`);
        }
    }

    abstract tag: string;
    abstract maxHealth: number;
    abstract damage: number;
    abstract speed: number;
    
    private readonly _id: string = generateObjectUUID();
    private _sprite: Sprite | Container | null = null;
    private _health: number = 0;
    constructor(){this.initialize()}
    private initialize() {
        this._health = this.maxHealth;
    }
    get id():string{return this._id};
    get health():number{return this._health};
    set health(value:number){this._health = value};
    get sprite():Sprite|Container{return this._sprite as (Sprite | Container)};
    set sprite(sprite:Sprite|Container){this._sprite = sprite};

    tick(delta: number){
        // do nothing
    }
}

// Example of extending Entity
export class Fox extends Entity{
    static tag: string = 'fox';
    tag: string = Fox.tag;
    maxHealth: number = 100;
    damage: number = 10;
    speed: number = 10;
    constructor(){
        super();
    }
    static {Entity.register(Fox.tag, Fox);}
}

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
    private _damage: number = 0;
    private _speed: number = 0;
    private _angle: number = 0;
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
        this.health -= delta/1000;
        if(this.health <= 0){
            this.destroy();
        }
    }

    destroy(){
        this.sprite.destroy();
    }
}

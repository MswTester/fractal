import { Container, Sprite } from "pixi.js";
import { generateObjectUUID } from "./utils/auth";

export default abstract class Projectile{
    private static registry: Map<string, new (...args:any[]) => Projectile> = new Map();
    static register(tag: string, projectile: new (...args:any[]) => Projectile){
        Projectile.registry.set(tag, projectile);
    }
    static create(tag: string):Projectile {
        const sub = Projectile.registry.get(tag);
        if(sub){
            return new sub();
        } else {
            throw new Error(`Projectile with tag ${tag} not found`);
        }
    }

    abstract tag: string;
    abstract maxHealth: number;
    abstract damage: number;
    abstract speed: number;
    
    private readonly _id: string = generateObjectUUID();
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

    tick(delta: number){
        this.health -= delta/1000;
        if(this.health <= 0) this.health = 0;
    }
}

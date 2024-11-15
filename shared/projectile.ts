import { Container, Sprite } from "pixi.js";
import { generateObjectUUID } from "./utils/auth";
import { EventEmitter } from "./utils/features";
import { pointColBound } from "./utils/vector";

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
    private _emitter:EventEmitter = new EventEmitter();
    on(event: string, listener: (...args: any[]) => void){this._emitter.on(event, listener)};
    emit(event: string, ...args: any[]){this._emitter.emit(event, ...args)};
    off(event: string, listener: (...args: any[]) => void){this._emitter.off(event, listener)};
    removeAllListeners(event: string){this._emitter.removeAllListeners(event)};

    abstract tag: string;
    abstract maxHealth: number;
    abstract dDamage: number;
    abstract dSpeed: number;
    abstract dCates: string[];

    private readonly _id: string = generateObjectUUID();
    private _health: number = 0;
    private _damage: number = 0;
    private _position: Point = {x: 0, y: 0};
    private _velocity: Point = {x: 0, y: 0};
    private _rotation: number = 0;
    private _scale: Point = {x: 1, y: 1};
    private _cates: string[] = [];
    private _state: string = '';
    constructor(){this.initialize()}
    private initialize() {
        this._health = this.maxHealth;
        this._damage = this.dDamage;
    }
    get id():string{return this._id};
    get health():number{return this._health};
    set health(value:number){this._health = value};

    tick(delta: number){
        if(this.health <= 0) {
            this.health = 0;
            this.destroy();
        }
    }

    getState(){
        return {
            
        }
    }

    setState(_state:{}):void{

    }

    isColliding(bound: Bound):boolean{
        return pointColBound(this._position, bound);
    }

    destroy(){
        this.emit("destroy");
    }
}

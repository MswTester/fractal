import { Container, Sprite } from "pixi.js";
import { generateObjectUUID } from "./utils/auth";
import { EventEmitter } from "./utils/features";

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
    private _emitter:EventEmitter = new EventEmitter();
    on(event: string, listener: (...args: any[]) => void){this._emitter.on(event, listener)};
    emit(event: string, ...args: any[]){this._emitter.emit(event, ...args)};
    off(event: string, listener: (...args: any[]) => void){this._emitter.off(event, listener)};
    removeAllListeners(event: string){this._emitter.removeAllListeners(event)};

    abstract tag: string;
    abstract maxHealth: number;
    abstract dDamage: number;
    abstract dSpeed: number;
    abstract dFriction: number;
    abstract dScale: Point;
    abstract dAnchor: Point;
    
    private readonly _id: string = generateObjectUUID();
    private _health: number = 0;
    private _position: Point = {x: 0, y: 0};
    private _velocity: Point = {x: 0, y: 0};
    private _rotation: number = 0;
    private _scale: Point = {x: 1, y: 1};
    constructor(){this.initialize()}
    private initialize() {
        this._health = this.maxHealth;
    }
    get id():string{return this._id};
    get health():number{return this._health};
    set health(value:number){this._health = value};
    get position():Point{return this._position};
    set position(value:Point|number[]){
        if(Array.isArray(value)){
            this._position.x = value[0];
            this._position.y = value[1];
        } else {
            this._position = value;
        }
    }
    get velocity():Point{return this._velocity};
    set velocity(value:Point|number[]){
        if(Array.isArray(value)){
            this._velocity.x = value[0];
            this._velocity.y = value[1];
        } else {
            this._velocity = value;
        }
    }
    get rotation():number{return this._rotation};
    set rotation(value:number){this._rotation = value};
    get scale():Point{return this._scale};
    set scale(value:Point|number[]){
        if(Array.isArray(value)){
            this._scale.x = value[0];
            this._scale.y = value[1];
        } else {
            this._scale = value;
        }
    };

    tick(delta: number){
        const deceleration = 1 - this.dFriction;
        if(this._velocity.x >= this.dSpeed / deceleration){this._velocity.x = this.dSpeed;}
        if(this._velocity.x <= -this.dSpeed / deceleration){this._velocity.x = -this.dSpeed;}
        if(this._velocity.y >= this.dSpeed / deceleration){this._velocity.y = this.dSpeed;}
        if(this._velocity.y <= -this.dSpeed / deceleration){this._velocity.y = -this.dSpeed;}
        this._position.x += this._velocity.x * delta/100;
        this._position.y += this._velocity.y * delta/100;
        this._velocity.x *= deceleration;
        this._velocity.y *= deceleration;
    }

    move(angle: number){
        this._velocity.x += this.dSpeed * Math.sin(angle) * this.dFriction;
        this._velocity.y += this.dSpeed * Math.cos(angle) * this.dFriction;
    }

    destroy(){
        this.emit('destroy');
    }
}

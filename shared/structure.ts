import { generateObjectUUID } from "./utils/auth";
import { EventEmitter } from "./utils/features";

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
    private _emitter:EventEmitter = new EventEmitter();
    on(event: string, listener: (...args: any[]) => void){this._emitter.on(event, listener)};
    emit(event: string, ...args: any[]){this._emitter.emit(event, ...args)};
    off(event: string, listener: (...args: any[]) => void){this._emitter.off(event, listener)};
    removeAllListeners(event: string){this._emitter.removeAllListeners(event)};

    abstract tag: string;
    abstract maxHealth: number;
    abstract dCates: string[];

    private readonly _id: string = generateObjectUUID();
    private _health: number = 0;
    private _position: Point = {x: 0, y: 0};
    private _velocity: Point = {x: 0, y: 0};
    private _rotation: number = 0;
    private _scale: Point = {x: 1, y: 1};
    private _cates: string[] = [];
    private _state: string = '';
    constructor(){this.initialize()}
    private initialize() {
        this._health = this.maxHealth;
    }
    get id():string{return this._id};
    get health():number{return this._health};

    tick(delta: number){
        // do nothing
    }

    getState(){
        return {
            
        }
    }

    setState(_state:{}):void{

    }
}
import { generateObjectUUID } from "./utils/auth";
import { EventEmitter } from "./utils/features";

export default abstract class Item{
    private static registry: Map<string, new () => Item> = new Map();
    static register(tag: string, item: new () => Item){
        Item.registry.set(tag, item);
    }
    static create(tag: string):Item {
        const sub = Item.registry.get(tag);
        if(sub){
            return new sub();
        } else {
            throw new Error(`Item with tag ${tag} not found`);
        }
    }
    private _emitter:EventEmitter = new EventEmitter();
    on(event: string, listener: (...args: any[]) => void){this._emitter.on(event, listener)};
    emit(event: string, ...args: any[]){this._emitter.emit(event, ...args)};
    off(event: string, listener: (...args: any[]) => void){this._emitter.off(event, listener)};
    removeAllListeners(event: string){this._emitter.removeAllListeners(event)};

    abstract readonly tag: string;
    // 공격형 아이템 속성 (대개)
    abstract dDamage: number; // amount
    abstract dCriticalChance: number; // float
    abstract dCriticalDamage: number; // float (multiplier)
    abstract dKnockback: number; // amount
    abstract dCooldown: number; // ms
    
    private readonly _id: string = generateObjectUUID();
    private _mainDown: boolean = false;
    private _subDown: boolean = false;
    private _restCooldown: number = 0;
    constructor(){this.initialize()}
    private initialize() {
    }
    get id():string{return this._id};
    get mainDown():boolean{return this._mainDown};
    set mainDown(value: boolean){this._mainDown = value};
    get subDown():boolean{return this._subDown};
    set subDown(value: boolean){this._subDown = value};
    get restCooldown():number{return this._restCooldown};
    set restCooldown(value: number){this._restCooldown = value};

    tick(delta: number){}
    mainInteraction(){}
    subInteraction(){}
}
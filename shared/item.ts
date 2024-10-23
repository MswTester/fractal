import { generateObjectUUID } from "./utils/auth";

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

    abstract readonly tag: string;
    // 공격형 아이템 속성 (대개)
    abstract readonly damage: number; // amount
    abstract readonly criticalChance: number; // float
    abstract readonly criticalDamage: number; // float (multiplier)
    abstract readonly knockback: number; // amount
    abstract readonly cooldown: number; // ms
    
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
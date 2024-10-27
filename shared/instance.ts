import Entity from "./entity";
import Structure from "./structure";
import World from "./world";
import TestMap from "./worlds/testMap";
import Projectile from "./projectile";
import { EventEmitter } from "./utils/features";

interface DynamicState{
    time?: number;
    wave?: number;
    leftWaitingTime?: number;
    state?: 'waiting'|'running';
    entities?: Entity[];
    structures?: Structure[];
    projectiles?: Projectile[];
}

export default class Instance{
    private _emitter:EventEmitter = new EventEmitter();
    on(event: string, listener: (...args: any[]) => void){this._emitter.on(event, listener)};
    emit(event: string, ...args: any[]){this._emitter.emit(event, ...args)};
    off(event: string, listener: (...args: any[]) => void){this._emitter.off(event, listener)};
    removeAllListeners(event: string){this._emitter.removeAllListeners(event)};

    // configures
    private readonly _waitingTime = 10000;

    // properties
    private _id: string; // room's uuid
    private _players: IUser[]; // array of IUser
    private _ownerId: string;
    private _entities: Entity[] = [];
    private _structures: Structure[] = [];
    private _projectiles: Projectile[] = [];
    private _time: number = 0; // ms
    private _state: 'waiting'|'running' = 'waiting';
    private _wave: number = 0;
    private _leftWaitingTime: number = this._waitingTime; // ms
    private _world: World = new TestMap();
    private _lastState: DynamicState = {
        time: this._time,
        wave: this._wave,
        leftWaitingTime: this._waitingTime,
        state: this._state,
        entities: this._entities,
        structures: this._structures,
        projectiles: this._projectiles,
    };

    constructor(id: string, players: IUser[], ownerId:string){
        this._id = id;
        this._players = players;
        this._ownerId = ownerId;
    }
    get id():string{return this._id};
    get maxWave():number{return this._world.waves.length};
    get entities():Entity[]{return this._entities};
    get structures():Structure[]{return this._structures};
    get projectiles():Projectile[]{return this._projectiles};
    get world():World{return this._world};
    get time():number{return this._time};
    get state():'waiting'|'running'{return this._state};
    get wave():number{return this._wave};
    get leftWaitingTime():number{return this._leftWaitingTime};

    tick(delta: number){
        // tick entities
        this._entities.forEach(entity => entity.tick(delta));
        // tick structures
        this._structures.forEach(structure => structure.tick(delta));
        // tick projectiles
        this._projectiles.forEach(projectile => projectile.tick(delta));

        this._time += delta;
    }

    update(state?:DynamicState){
    }

    // get dynamic state includes only changed properties
    getDynamicState(){
        const state: DynamicState = {
            time: this._time,
            wave: this._wave,
            leftWaitingTime: this._leftWaitingTime,
            state: this._state,
            entities: this._entities,
            structures: this._structures,
            projectiles: this._projectiles,
        }
        const diff = Object.keys(state).reduce((acc:any, key) => {
            if(this._lastState[key as keyof DynamicState] !== state[key as keyof DynamicState]){
                acc[key as keyof DynamicState] = state[key as keyof DynamicState];
            }
            return acc;
        }, {});
        this._lastState = state;
        return diff;
    }

    addEntity(entity: Entity){this._entities.push(entity)}
    removeEntity(entity: Entity){this._entities = this._entities.filter(e => e !== entity)}
}
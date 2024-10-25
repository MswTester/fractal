import Entity from "./entity";
import Structure from "./structure";
import World from "./world";
import TestMap from "./worlds/testMap";
import Projectile from "./projectile";

export default class Instance{
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

    constructor(id: string, players: IUser[], ownerId:string){
        this._id = id;
        this._players = players;
        this._ownerId = ownerId;
    }
    get id():string{return this._id};
    get maxWave():number{return this._world.waves.length};

    tick(delta: number){
        // tick entities
        this._entities.forEach(entity => entity.tick(delta));
        // tick structures
        this._structures.forEach(structure => structure.tick(delta));
        // tick projectiles
        this._projectiles.forEach(projectile => projectile.tick(delta));

        this._time += delta;
    }

    addEntity(entity: Entity){this._entities.push(entity)}
    removeEntity(entity: Entity){this._entities = this._entities.filter(e => e !== entity)}
}
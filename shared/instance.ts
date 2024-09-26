import Entity from "./entity";
import Structure from "./structure";

export default class Instance{
    private _id: string; // room's uuid
    private _players: IUser[]; // array of IUser
    private _ownerId: string;
    private _entities: Entity[] = [];
    private _structures: Structure[] = [];
    private _time: number = 0;
    private _state: GameState = GameState.WAITING;
    private _wave: number = 0;
    constructor(id: string, players: IUser[], ownerId:string){
        this._id = id;
        this._players = players;
        this._ownerId = ownerId;
    }

    tick(delta: number){
        // tick entities
        this._entities.forEach(entity => entity.tick(delta));
        // tick structures
        this._structures.forEach(structure => structure.tick(delta));

        this._time += delta;
    }
}
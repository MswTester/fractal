import Entity from "./entity";
import Map from "./map";

export default class Instance{
    id: string;
    players: IUser[]; // array of IUser
    ownerId: string;
    map:Map;
    entities: Entity[];
    constructor(id: string, players: IUser[], ownerId:string){
        this.id = id;
        this.players = players;
        this.ownerId = ownerId;
        this.map = new Map("default");
        this.entities = [];
    }
}
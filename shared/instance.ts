export default class Instance{
    id: string;
    players: IUser[]; // array of IUser
    ownerId: string;
    constructor(id: string, players: IUser[], ownerId:string){
        this.id = id;
        this.players = players;
        this.ownerId = ownerId;
    }
}
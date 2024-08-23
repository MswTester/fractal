export default class Room{
    id: string;
    name: string;
    players: IUser[]; // array of IUser
    ownerId: string;
    ownerSocketId: string;
    maxPlayers: number;
    isPrivate: boolean;
    constructor(id: string, name: string, owner:IUser, socketId:string, maxPlayers: number, isPrivate: boolean){
        this.id = id;
        this.name = name;
        this.players = [owner];
        this.ownerId = owner.id;
        this.ownerSocketId = "";
        this.maxPlayers = maxPlayers;
        this.isPrivate = isPrivate;
    }
    addPlayer(player: IUser){
        if(this.players.length < this.maxPlayers){
            this.players.push(player);
            return true;
        }
        return false;
    }
    removePlayer(player: IUser){
        const index = this.players.indexOf(player);
        if(index > -1){
            this.players.splice(index, 1);
            return true;
        }
        return false;
    }
    isFull(){
        return this.players.length === this.maxPlayers;
    }
    isEmpty(){
        return this.players.length === 0;
    }
    serialize(){
        return {
            id: this.id,
            name: this.name,
            players: this.players.map(player => player.id),
            ownerId: this.ownerId,
            ownerSocketId: this.ownerSocketId,
            maxPlayers: this.maxPlayers,
        }
    }
}
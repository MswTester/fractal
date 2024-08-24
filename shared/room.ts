export default class Room{
    id: string;
    name: string;
    players: IUser[]; // array of IUser
    ownerId: string;
    maxPlayers: number;
    isPrivate: boolean;
    map: number;
    mode: number;
    constructor(id: string, name: string, owner:IUser, maxPlayers: number, isPrivate: boolean){
        this.id = id;
        this.name = name;
        this.players = [owner];
        this.ownerId = owner.id;
        this.maxPlayers = maxPlayers;
        this.isPrivate = isPrivate;
        this.map = 0;
        this.mode = 0;
    }
    join(player: IUser){
        if(this.players.length < this.maxPlayers){
            this.players.push(player);
            return true;
        }
        return false;
    }
    leave(player: string){
        if(this.players.length > 0){
            this.players = this.players.filter(p => p.id !== player);
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
    serialize():IRoom{
        return {
            id: this.id,
            name: this.name,
            players: this.players.map(player => {
                return {
                    id: player.id,
                    username: player.username,
                    avatar: player.avatar,
                    lvl: player.lvl,
                    equipments: player.equipments
                } as IDisplayUser
            }),
            ownerId: this.ownerId,
            maxPlayers: this.maxPlayers,
            isPrivate: this.isPrivate,
            map: this.map,
            mode: this.mode
        }
    }
    getDisplay():IDisplayRoom{
        return {
            id: this.id,
            name: this.name,
            ownerName: this.players[0].username,
            ownerLvl: this.players[0].lvl,
            mode: this.mode,
            map: this.map,
            players: this.players.length,
            maxPlayer: this.maxPlayers
        }
    }
}
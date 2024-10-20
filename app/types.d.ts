interface IMessage{
    message:string;
    time:number;
}

interface IDisplayRoom{
    id: string; // room uuid
    name: string; // room name
    ownerName: string; // room owner name
    ownerLvl: number; // room owner level
    mode: number; // room mode
    map: number; // room map
    players: number; // room players
    maxPlayer: number; // room max player
}

interface IRoom{
    id: string; // room uuid
    name: string; // room name
    players: IDisplayUser[]; // room players
    ownerId: string; // room owner id
    maxPlayers: number; // room max players
    isPrivate: boolean; // room privacy
    map: number; // room map
    mode: number; // room mode
}

interface IDisplayUser{
    id: string; // user uuid
    username: string; // user name
    avatar: string; // user avatar
    lvl: number; // user level
    equipments: IEquipment[]; // user equipment
}

interface IRune{
    id: string; // rune uuid
    tag: string; // rune tag
    lvl: number; // rune level
}

interface IItem{
    id: string; // item uuid
    tag: string; // item tag
    lvl: number; // item level
    exp: number; // item experience
    skills: number[]; // item skill levels
    runes: IRune[]; // item runes
}

interface IEquipment{
    id: string; // equipped item uuid
    tag: string; // equipped item tag
    slot: number; // equipped item slot
}

interface IUser {
    // default user structure
    id: string; // user uuid
    username: string; // user name
    password: string; // user password
    avatar: string; // data:image/png;base64
    admin: boolean; // user admin
    banned: boolean; // user banned

    // user stats
    lvl: number;
    exp: number;
    gem: number;
    coin: number;
    lastLogin: number;
    lastLogout: number;
    items: IItem[]; // items
    runes: IRune[]; // runes
    equipments: IEquipment[]; // equipped items
    friends: string[]; // friends id

    // achievements stats
    totalClear: number;
    totalFail: number;
    totalPlay: number;
    totalMobKill: number;
    totalBossKill: number;
    totalDeath: number;
    totalWin: number; // pvp mode only
    totalLose: number; // pvp mode only
    totalDraw: number; // pvp mode only
    totalPvpKill: number; // pvp mode only
    totalPvpDeath: number; // pvp mode only
}

interface IClan{
    id: string; // clan uuid
    name: string; // clan name
    description: string; // clan description
    avatar: string; // data:image/png;base64
    master: string; // clan master id
    submasters: string[]; // clan submasters id
    members: string[]; // clan members id

    // clan stats
    lvl: number;
    exp: number;
    coin: number;
}

interface IItem{
    id: string; // item uuid
    tag: string; // item tag
    lvl: number; // item level
    effects: number[]; // item effects
}

interface IUser {
    // default user structure
    id: string; // user uuid
    username: string; // user name
    password: string; // user password
    avatar: string; // data:image/png;base64
    admin: boolean;
    banned: boolean;

    // user stats
    lvl: number;
    exp: number;
    gem: number;
    coin: number;
    lastLogin: number;
    lastLogout: number;
    unlockedItems: IItem[]; // unlocked items
    unlockedSkills: number[]; // unlocked skills

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
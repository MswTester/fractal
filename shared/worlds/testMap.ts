import World from "~/world";

export default class TestMap extends World{
    static tag: string = 'testMap';
    tag: string = TestMap.tag;
    maxWave: number = 2;
    width: number = 4;
    height: number = 4;
    tileAssets: string[] = [
        '/assets/ttpack/Dirt/Dirt_17-512x512.png',
        '/assets/ttpack/Dirt/Dirt_18-512x512.png',
        '/assets/ttpack/Dirt/Dirt_19-512x512.png',
        '/assets/ttpack/Dirt/Dirt_20-512x512.png',
    ];
    tileMap: number[][] = [
        [0, 1, 2, 3],
        [0, 1, 2, 3],
        [0, 1, 2, 3],
        [2, 2, 2, 2],
    ];
    effects: IEffect[] = [];
    envAssets: string[] = [];
    environments: IEnvironment[] = [];
    entityAssets: string[] = [
        '/assets/test/heartsping.webp',
        '/assets/test/gogoping.webp',
    ];
    playerSpawn: Bound = {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
    };
    enemySpawn: Bound[] = [
        {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
        },
        {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
        },
        {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
        },
    ];
    waves: IWaveEnemy[][] = [
        [
            {
                idx: 0,
                tag: 'fox',
                amount: 5,
                spawn: 0,
            },
            {
                idx: 1,
                tag: 'wolf',
                amount: 5,
                spawn: 1,
            },
        ],
        [
            {
                idx: 0,
                tag: 'fox',
                amount: 10,
                spawn: 0,
            },
            {
                idx: 1,
                tag: 'wolf',
                amount: 10,
                spawn: 1,
            },
        ],
    ];
    constructor(){
        super();
    }
    static {World.register(TestMap.tag, TestMap);}
}
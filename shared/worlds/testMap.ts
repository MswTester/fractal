import World from "~/world";

export default class TestMap extends World{
    static tag: string = 'testMap';
    tag: string = TestMap.tag;
    maxWave: number = 2;
    width: number = 4;
    height: number = 4;
    tiles: string[] = [
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
    playerSpawn: IZone = {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
    };
    enemySpawn: IZone[] = [
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
                tag: 'fox',
                amount: 5,
                spawn: 0,
            },
            {
                tag: 'wolf',
                amount: 5,
                spawn: 1,
            },
        ],
        [
            {
                tag: 'fox',
                amount: 10,
                spawn: 0,
            },
            {
                tag: 'wolf',
                amount: 10,
                spawn: 1,
            },
        ],
    ];
    environment: IEnvironment[] = [];
    constructor(){
        super();
    }
    static {World.register(TestMap.tag, TestMap);}
}
type vec2 = [number, number];
type vec3 = [number, number, number];
type vec4 = [number, number, number, number];

interface IEffect{
    type: string;
    options: any;
}

interface IEnvironment{
    idx: number;
    x: number;
    y: number;
    width: number;
    height: number;
    hitboxScale: Point;
    isCollidable: boolean;
}

interface Point{
    x: number;
    y: number;
}

interface IWaveEnemy{
    idx: number; // entity asset idx
    tag: string; // Entity tag
    amount: number;
    spawn: number; // spawnZone index
}

interface Bound{
    x: number;
    y: number;
    width: number;
    height: number;
}
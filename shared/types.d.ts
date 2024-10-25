type vec2 = [number, number];
type vec3 = [number, number, number];
type vec4 = [number, number, number, number];

interface IEnvironment{
    type: string;
    amount: number;
}

interface Point{
    x: number;
    y: number;
}

interface IWaveEnemy{
    tag: string; // Entity tag
    amount: number;
    spawn: number; // spawnZone index
}

interface IZone{
    x: number;
    y: number;
    width: number;
    height: number;
}
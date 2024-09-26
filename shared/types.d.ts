type vec2 = [number, number];
type vec3 = [number, number, number];
type vec4 = [number, number, number, number];

enum GameState{
    WAITING,
    RUNNING,
}

interface IEnvironment{
    type: string;
    amount: number;
}

interface IWaveEnemy{
    type: string;
    amount: number;
}
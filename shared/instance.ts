import { Application, Container, Sprite, Ticker, TickerCallback } from "pixi.js";
import Entity from "./entity";
import Structure from "./structure";
import World from "./world";
import Default from "./worlds/default";

export default class Instance{
    // configures
    private readonly _waitingTime = 10000;

    // properties
    private _app = new Application();
    private _keymap: string[] = [];
    private _camera: Container = new Container();
    private _id: string; // room's uuid
    private _players: IUser[]; // array of IUser
    private _ownerId: string;
    private _map: string = '';
    private _entities: Entity[] = [];
    private _structures: Structure[] = [];
    private _time: number = 0; // ms
    private _state: 'waiting'|'running' = 'waiting';
    private _wave: number = 0;
    private _leftWaitingTime: number = this._waitingTime; // ms
    private _world: World = new Default();
    private _tileSize: number = 32;

    constructor(id: string, players: IUser[], ownerId:string){
        this._id = id;
        this._players = players;
        this._ownerId = ownerId;
        this._app.stage.addChild(this._camera);
    }
    get id():string{return this._id};
    get app():Application{return this._app};
    get maxWave():number{return this._world.waves.length};
    async init(window: Window){
        await this._app.init({
            backgroundColor: 0x1099bb,
            resizeTo: window,
        })
        this.addTicker((ticker) => this.tick(ticker.deltaTime));
        this.resize();
    }
    isDown(key: string):boolean{
        return this._keymap.includes(key);
    }
    resize(){
        this._camera.position.set(this._app.screen.width / 2, this._app.screen.height / 2);
        this._tileSize = Math.min(this._app.screen.width / this._world.width, this._app.screen.height / this._world.height);
    };
    keydown(e: KeyboardEvent){
        if (!this._keymap.includes(e.key)) {
            this._keymap.push(e.key);
        }
    }
    keyup(e: KeyboardEvent){
        this._keymap = this._keymap.filter(key => key !== e.key);
    }
    destroy(){
        this._app.destroy();
    }

    tick(delta: number){
        // tick entities
        this._entities.forEach(entity => entity.tick(delta));
        // tick structures
        this._structures.forEach(structure => structure.tick(delta));

        this._time += delta;
        this._camera.children.forEach(sprite => {
            sprite.zIndex = -sprite.y;
        });
        this._camera.sortChildren();
    }
    addTicker(fn: TickerCallback<any>, context?: any, priority?: number):Ticker{
        return this._app.ticker.add(fn, context, priority);
    }

    addSprite(sprite: Sprite | Container){
        this._camera.addChild(sprite);
    }
    removeSprite(sprite: Sprite | Container){
        this._camera.removeChild(sprite);
    }
}
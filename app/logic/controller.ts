import { Application, Assets, Container, Graphics, Sprite, Ticker, TickerCallback } from "pixi.js";
import Entity from "~/entity";
import Instance from "~/instance";
import World from "~/world";

export default class Controller{
    private _keymap: Set<string> = new Set();
    private _app: Application = new Application();
    private _camera: Container = new Container();
    private _debugger: Graphics = new Graphics();
    private _tileSize: number = 0;
    private _instance: Instance;
    private _isClient: boolean = false;
    private _keydownFn: Map<string, (...args: any[]) => void> = new Map();
    private _keyupFn: Map<string, (...args: any[]) => void> = new Map();
    private _keypressedFn: Map<string, (...args: any[]) => void> = new Map();

    constructor(instance: Instance, client:boolean = false){
        this._instance = instance;
        this._isClient = client;
    }
    
    get app():Application{return this._app}
    get tileSize():number{return this._tileSize}
    get instance():Instance{return this._instance}
    
    async init(window: Window){
        await this._app.init({
            backgroundColor: 0xabcdef,
            resizeTo: window,
        })
        this.addTicker((ticker) => this.tick(ticker.deltaTime));
        this.resize();
        this._app.stage.addChild(this._camera);
        this.applyWorld(this._instance.world);
    }
    applyWorld(world: World){
    }
    isDown(key: string):boolean{return this._keymap.has(key)}
    resize(){
        const screenWidth = innerWidth, screenHeight = innerHeight;
        this._camera.position.set(screenWidth / 2, screenHeight / 2);
        this._tileSize = Math.max(screenWidth * (9/16) / 10, screenHeight / 10);
    };
    addResizeEvent(element: Window){element.addEventListener("resize", this.resize.bind(this))}
    removeResizeEvent(element: Window){element.removeEventListener("resize", this.resize.bind(this))}
    keydown(e: KeyboardEvent){
        this._keymap.add(e.key);
        if(this._keydownFn.has(e.key)) this._keydownFn.get(e.key)?.call(this, e);
    }
    keyup(e: KeyboardEvent){
        this._keymap.delete(e.key);
        if(this._keyupFn.has(e.key)) this._keyupFn.get(e.key)?.call(this, e);
    }
    addKeydownEvent(element: Document){element.addEventListener("keydown", this.keydown.bind(this))}
    removeKeydownEvent(element: Document){element.removeEventListener("keydown", this.keydown.bind(this))}
    addKeyupEvent(element: Document){element.addEventListener("keyup", this.keyup.bind(this))}
    removeKeyupEvent(element: Document){element.removeEventListener("keyup", this.keyup.bind(this))}
    addTicker(fn: TickerCallback<any>, context?: any, priority?: number):Ticker{return this._app.ticker.add(fn, context, priority)}
    destroy(){
        this._keymap.clear()
        this._app.destroy()
    }

    tick(delta: number){
        // sort children
        this._camera.children.forEach(sprite => {
            sprite.zIndex = -sprite.y;
        });
        this._camera.sortChildren();
        // is client instance
        if(this._isClient){
            this._instance.tick(delta);
        } else {
            this._instance.update();
        }
        // update entities
        this._instance.entities.forEach(entity => {
            const sprite = this.getChild(entity.id);
            if(sprite){
                sprite.position.set(entity.position.x * this._tileSize, entity.position.y * this._tileSize);
                sprite.rotation = entity.rotation;
                sprite.setSize(this._tileSize * entity.dScale.x, this._tileSize * entity.dScale.y);
                sprite.scale.set(entity.scale.x, entity.scale.y);
            }
        });
        // keypressed
        this._keymap.forEach(key => {
            if(this._keypressedFn.has(key)) this._keypressedFn.get(key)?.call(this);
        });
    }
    addEntity(entity: Entity, _category:string = 'entities', _extender: string = 'svg'){
        this._instance.addEntity(entity);
        const _sprite = new Sprite(Assets.get(`/assets/${_category}/${entity.tag}.${_extender}`));
        _sprite.anchor.set(0.5);
        _sprite.position.set(entity.position.x, entity.position.y);
        _sprite.rotation = entity.rotation;
        _sprite.setSize(this._tileSize * entity.dScale.x, this._tileSize * entity.dScale.y);
        _sprite.scale.set(entity.scale.x, entity.scale.y);
        _sprite.label = entity.id;
        this._camera.addChild(_sprite);
        entity.on('destroy', () => {
            entity.removeAllListeners("destroy");
            this.removeEntity(entity);
        });
    }
    removeEntity(entity: Entity){
        this._instance.removeEntity(entity);
        const sprite = this.getChild(entity.id);
        if(sprite){
            this._camera.removeChild(sprite);
            sprite.destroy();
        }
    }
    getChild(label: string):Container|Sprite|null{return this._camera.getChildByLabel(label);}
    onKeydown(key: string, callback: (...args: any[]) => void){this._keydownFn.set(key, callback);}
    onKeyup(key: string, callback: (...args: any[]) => void){this._keyupFn.set(key, callback);}
    onKeypress(key: string, callback: (...args: any[]) => void){this._keypressedFn.set(key, callback);}
}
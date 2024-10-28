import { Application, Assets, Container, Graphics, Sprite, Ticker, TickerCallback } from "pixi.js";
import Entity from "~/entity";
import Instance from "~/instance";
import World from "~/world";

const tileScaleDivisor = 12;
const cameraFriction = 10;

export default class Controller{
    private _keymap: Set<string> = new Set();
    private _buttonmap: Set<number> = new Set();
    private _app: Application = new Application();
    private _camera: Container = new Container();
    private _cameraPosition: Point = {x: 0, y: 0};
    private _cameraBinder: string = ''; // entity id
    private _debugger: Graphics = new Graphics();
    private _tileSize: number = 0;
    private _instance: Instance;
    private _isClient: boolean = false;
    private _keydownFn: Map<string, (...args: any[]) => void> = new Map();
    private _keyupFn: Map<string, (...args: any[]) => void> = new Map();
    private _keypressedFn: Map<string, (...args: any[]) => void> = new Map();
    private _buttondownFn: Map<number, (...args: any[]) => void> = new Map();
    private _buttonupFn: Map<number, (...args: any[]) => void> = new Map();
    private _buttonpressedFn: Map<number, (...args: any[]) => void> = new Map();
    private _cursorPosition: Point = {x: 0, y: 0};

    constructor(instance: Instance, client:boolean = false){
        this._instance = instance;
        this._isClient = client;
    }
    
    get app():Application{return this._app}
    get tileSize():number{return this._tileSize}
    get instance():Instance{return this._instance}
    get camera():Container{return this._camera}
    get cameraPosition():Point{return this._cameraPosition}
    
    async init(window: Window){
        await this._app.init({
            backgroundColor: 0xabcdef,
            resizeTo: window,
        })
        this.addTicker((ticker) => this.tick(ticker.deltaMS));
        this.resize();
        this._app.stage.addChild(this._camera);
        await Assets.load(this._instance.world.envAssets);
        this.applyWorld(this._instance.world);
    }
    applyWorld(world: World){
    }
    bindToCamera(entity: Entity){
        this._cameraBinder = entity.id;
    }
    isKeydown(key: string):boolean{return this._keymap.has(key)}
    isButtondown(button: number):boolean{return this._buttonmap.has(button)}
    resize(){
        const screenWidth = innerWidth, screenHeight = innerHeight;
        this._camera.position.set(screenWidth / 2, screenHeight / 2);
        this._tileSize = Math.max(screenWidth * (9/16) / tileScaleDivisor, screenHeight / tileScaleDivisor);
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
    updateCursorPos(e: MouseEvent){
        this._cursorPosition.x = e.clientX;
        this._cursorPosition.y = e.clientY;
    }
    buttondown(e: MouseEvent){
        this._buttonmap.add(e.button);
        this.updateCursorPos(e);
        if(this._buttondownFn.has(e.button)) this._buttondownFn.get(e.button)?.call(this, this._cursorPosition);
    }
    buttonup(e: MouseEvent){
        this._buttonmap.delete(e.button);
        this.updateCursorPos(e);
        if(this._buttonupFn.has(e.button)) this._buttonupFn.get(e.button)?.call(this, this._cursorPosition);
    }
    mousemove(e: MouseEvent){
        this.updateCursorPos(e);
    }
    addKeydownEvent(element: Document){element.addEventListener("keydown", this.keydown.bind(this))}
    removeKeydownEvent(element: Document){element.removeEventListener("keydown", this.keydown.bind(this))}
    addKeyupEvent(element: Document){element.addEventListener("keyup", this.keyup.bind(this))}
    removeKeyupEvent(element: Document){element.removeEventListener("keyup", this.keyup.bind(this))}
    addButtondownEvent(element: Document){element.addEventListener("mousedown", this.buttondown.bind(this))}
    removeButtondownEvent(element: Document){element.removeEventListener("mousedown", this.buttondown.bind(this))}
    addButtonupEvent(element: Document){element.addEventListener("mouseup", this.buttonup.bind(this))}
    removeButtonupEvent(element: Document){element.removeEventListener("mouseup", this.buttonup.bind(this))}
    addMousemoveEvent(element: Document){element.addEventListener("mousemove", this.mousemove.bind(this))}
    removeMousemoveEvent(element: Document){element.removeEventListener("mousemove", this.mousemove.bind(this))}
    addTicker(fn: TickerCallback<any>, context?: any, priority?: number):Ticker{return this._app.ticker.add(fn, context, priority)}
    destroy(){
        this._keymap.clear()
        this._app.destroy()
    }

    tick(delta: number){
        // sort children
        this._camera.children.forEach(sprite => {
            sprite.zIndex = sprite.y;
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
                sprite.setSize(
                    this._tileSize * entity.dScale.x * entity.scale.x,
                    this._tileSize * entity.dScale.y * entity.scale.y
                );
            }
        });
        // keypressed
        this._keymap.forEach(key => {
            if(this._keypressedFn.has(key)) this._keypressedFn.get(key)?.call(this);
        });
        // buttonpressed
        this._buttonmap.forEach(button => {
            if(this._buttonpressedFn.has(button)) this._buttonpressedFn.get(button)?.call(this, this._cursorPosition);
        });
        // camera follow
        if(this._cameraBinder){
            const entity = this._instance.getEntity(this._cameraBinder);
            if(entity){
                const dx = entity.position.x - this._cameraPosition.x;
                const dy = entity.position.y - this._cameraPosition.y;
                this._cameraPosition.x += dx / (delta/cameraFriction);
                this._cameraPosition.y += dy / (delta/cameraFriction);
            }
        }
        // camera
        this._camera.pivot.set(
            this._cameraPosition.x * this._tileSize,
            this._cameraPosition.y * this._tileSize
        );
    }
    spawn(entity: Entity, _category:string = 'entities', _extender: string = 'svg'){
        this._instance.addEntity(entity);
        const _sprite = new Sprite(Assets.get(`/assets/${_category}/${entity.tag}.${_extender}`));
        _sprite.anchor.set(entity.dAnchor.x, entity.dAnchor.y);
        _sprite.position.set(entity.position.x, entity.position.y);
        _sprite.rotation = entity.rotation;
        _sprite.setSize(
            this._tileSize * entity.dScale.x * entity.scale.x,
            this._tileSize * entity.dScale.y * entity.scale.y
        );
        _sprite.label = entity.id;
        this._camera.addChild(_sprite);
        entity.on('destroy', () => {
            entity.removeAllListeners("destroy");
            this.despawn(entity);
        });
    }
    despawn(entity: Entity){
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
    offKeydown(key: string){this._keydownFn.delete(key);}
    offKeyup(key: string){this._keyupFn.delete(key);}
    offKeypress(key: string){this._keypressedFn.delete(key);}
    onButtondown(button: number, callback: (pos:Point, ...args: any[]) => void){}
    onButtonup(button: number, callback: (pos:Point, ...args: any[]) => void){}
    onButtonpress(button: number, callback: (pos:Point, ...args: any[]) => void){}
    offButtondown(button: number){}
    offButtonup(button: number){}
    offButtonpress(button: number){}
}
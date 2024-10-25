import { Application, Container, Sprite, Ticker, TickerCallback } from "pixi.js";

export default class Controller{
    private _keymap: Set<string> = new Set();
    private _app: Application = new Application();
    private _camera: Container = new Container();
    private _tileSize: number = 0;

    constructor(){
        this._app.stage.addChild(this._camera);
    }

    get app():Application{return this._app}
    get tileSize():number{return this._tileSize}

    async init(window: Window){
        await this._app.init({
            backgroundColor: 0xabcdef,
            resizeTo: window,
        })
        this.addTicker((ticker) => this.tick(ticker.deltaTime));
        this.resize();
    }
    isDown(key: string):boolean{return this._keymap.has(key)}
    resize(){
        const screenWidth = innerWidth, screenHeight = innerHeight;
        this._camera.position.set(screenWidth / 2, screenHeight / 2);
        this._tileSize = Math.max(screenWidth * (9/16) / 10, screenHeight / 10);
    };
    addResizeEvent(element: Window){element.addEventListener("resize", this.resize.bind(this))}
    removeResizeEvent(element: Window){element.removeEventListener("resize", this.resize.bind(this))}
    keydown(e: KeyboardEvent){this._keymap.add(e.key)}
    keyup(e: KeyboardEvent){this._keymap.delete(e.key)}
    addKeydownEvent(element: Document){element.addEventListener("keydown", this.keydown.bind(this))}
    removeKeydownEvent(element: Document){element.removeEventListener("keydown", this.keydown.bind(this))}
    addKeyupEvent(element: Document){element.addEventListener("keyup", this.keyup.bind(this))}
    removeKeyupEvent(element: Document){element.removeEventListener("keyup", this.keyup.bind(this))}
    destroy(){this._app.destroy()}
    addTicker(fn: TickerCallback<any>, context?: any, priority?: number):Ticker{return this._app.ticker.add(fn, context, priority)}

    tick(delta: number){
        this._camera.children.forEach(sprite => {
            sprite.zIndex = -sprite.y;
        });
        this._camera.sortChildren();
    }
    addSprite(sprite: Sprite | Container){this._camera.addChild(sprite);}
    removeSprite(sprite: Sprite | Container){this._camera.removeChild(sprite);}
}
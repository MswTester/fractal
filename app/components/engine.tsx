import { Application, Assets, Container, Sprite } from "pixi.js";
import { useRef, useState } from "react";
import Player from "~/entities/player";
import Entity from "~/entity";
import { useOnce } from "~/utils/hooks";

export default function App(props:{
    map: string;
    user: IUser;
}) {
    const appRef = useRef<HTMLDivElement>(null)
    const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false)
    const [keymap, setKeymap] = useState<string[]>([])
    
    useOnce(async () => {
        const app = new Application();
        await app.init({
            backgroundColor: 0x1099bb,
            resizeTo: window,
        })
        await Assets.load([
            "/assets/test/heartsping.webp",
            "/assets/test/gogoping.webp",
        ])
        appRef.current?.appendChild(app.canvas)
        setAssetsLoaded(true)
        
        let _keymap:string[] = [];
        let _camera = new Container();
        let _entityList:Entity[] = [];
        const resize = () => {
            _camera.position.set(app.screen.width / 2, app.screen.height / 2);
        };
        resize();
        app.stage.addChild(_camera);
        const myChar = new Player();
        myChar.equip(props.user.equipments);

        const heart = new Sprite(Assets.get("/assets/test/heartsping.webp"))
        heart.anchor.set(0.5)
        heart.setSize(100, 100)
        heart.position.set(0, 0)

        const gogo = new Sprite(Assets.get("/assets/test/gogoping.webp"))
        gogo.anchor.set(0.5)
        gogo.setSize(100, 100)
        gogo.position.set(0, 0)

        _camera.addChild(heart)
        _camera.addChild(gogo)

        const keydown = (e: KeyboardEvent) => {
            if (!_keymap.includes(e.key)) {
                _keymap.push(e.key)
                setKeymap(_keymap)
            }
        }
        const keyup = (e: KeyboardEvent) => {
            _keymap = _keymap.filter(key => key !== e.key)
            setKeymap(_keymap)
        }

        app.ticker.add((ticker) => {
            if (_keymap.includes("w")) {
                heart.y -= ticker.deltaTime
            }
            if (_keymap.includes("s")) {
                heart.y += ticker.deltaTime
            }
            if (_keymap.includes("a")) {
                heart.x -= ticker.deltaTime
            }
            if (_keymap.includes("d")) {
                heart.x += ticker.deltaTime
            }
        })

        window.addEventListener("resize", resize)
        window.addEventListener("keydown", keydown)
        window.addEventListener("keyup", keyup)
        return () => {
            app.destroy();
            window.removeEventListener("resize", resize)
            window.removeEventListener("keydown", keydown)
            window.removeEventListener("keyup", keyup)
        }
    })

    return (
        <main ref={appRef}>
            {assetsLoaded ? null : <p>Loading...</p>}
        </main>
    );
}
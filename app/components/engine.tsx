import { Application, Assets, Container, Sprite } from "pixi.js";
import { useRef, useState } from "react";
import Player from "~/entities/player";
import Entity from "~/entity";
import Instance from "~/instance";
import { generateUUID } from "~/utils/auth";
import { useOnce } from "~/utils/hooks";

export default function App(props:{
    map: string;
    user: IUser;
}) {
    const appRef = useRef<HTMLDivElement>(null)
    const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false)
    
    useOnce(async () => {
        const instance = new Instance(generateUUID(), [props.user], props.user.id);

        await instance.init(window)
        await Assets.load([
            "/assets/entities/player.svg",
            "/assets/test/heartsping.webp",
            "/assets/test/gogoping.webp",
        ])
        appRef.current?.appendChild(instance.app.canvas)
        setAssetsLoaded(true)
        const myChar = new Player();
        myChar.equip(props.user.equipments);
        myChar.sprite = new Sprite({
            texture: Assets.get(`/assets/entities/${myChar.tag}.svg`),
            anchor: {x:0.5, y:0.5},
            position: {x:0, y:0},
            width: instance.tileSize,
            height: 100,
        })
        instance.addEntity(myChar);

        const heart = new Sprite(Assets.get("/assets/test/heartsping.webp"))
        heart.anchor.set(0.5)
        heart.setSize(100, 100)
        heart.position.set(0, 0)

        const gogo = new Sprite(Assets.get("/assets/test/gogoping.webp"))
        gogo.anchor.set(0.5)
        gogo.setSize(100, 100)
        gogo.position.set(0, 0)

        instance.addTicker((ticker) => {
            if (instance.isDown("w")) {
                heart.y -= ticker.deltaTime
            }
            if (instance.isDown("s")) {
                heart.y += ticker.deltaTime
            }
            if (instance.isDown("a")) {
                heart.x -= ticker.deltaTime
            }
            if (instance.isDown("d")) {
                heart.x += ticker.deltaTime
            }
        })

        window.addEventListener("resize", instance.resize)
        window.addEventListener("keydown", instance.keydown)
        window.addEventListener("keyup", instance.keyup)
        return () => {
            instance.destroy();
            window.removeEventListener("resize", instance.resize)
            window.removeEventListener("keydown", instance.keydown)
            window.removeEventListener("keyup", instance.keyup)
        }
    })

    return (
        <main ref={appRef}>
            {assetsLoaded ? null : <p>Loading...</p>}
        </main>
    );
}
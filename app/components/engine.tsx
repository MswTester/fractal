import { Assets, Sprite } from "pixi.js";
import { useRef, useState } from "react";
import Player from "~/entities/player";
import Instance from "~/instance";
import Controller from "~/logic/controller";
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
        const controller = new Controller();

        await controller.init(window)
        await Assets.load([
            "/assets/entities/player.svg",
            "/assets/test/heartsping.webp",
            "/assets/test/gogoping.webp",
        ])
        appRef.current?.appendChild(controller.app.canvas)
        setAssetsLoaded(true)
        const myChar = new Player();
        myChar.equip(props.user.equipments);
        instance.addEntity(myChar);

        const heart = new Sprite(Assets.get("/assets/test/heartsping.webp"))
        heart.anchor.set(0.5)
        heart.setSize(100, 100)
        heart.position.set(0, 0)

        const gogo = new Sprite(Assets.get("/assets/test/gogoping.webp"))
        gogo.anchor.set(0.5)
        gogo.setSize(100, 100)
        gogo.position.set(0, 0)

        controller.addTicker((ticker) => {
            if (controller.isDown("w")) {
                myChar.move(0);
                heart.y -= ticker.deltaTime
            }
            if (controller.isDown("s")) {
                myChar.move(Math.PI/2);
                heart.y += ticker.deltaTime
            }
            if (controller.isDown("a")) {
                myChar.move(Math.PI/4*3);
                heart.x -= ticker.deltaTime
            }
            if (controller.isDown("d")) {
                myChar.move(Math.PI/4);
                heart.x += ticker.deltaTime
            }
        })

        controller.addResizeEvent(window)
        controller.addKeydownEvent(document)
        controller.addKeyupEvent(document)
        return () => {
            controller.destroy();
            controller.removeResizeEvent(window)
            controller.removeKeydownEvent(document)
            controller.removeKeyupEvent(document)
        }
    })

    return (
        <main ref={appRef}>
            {assetsLoaded ? null : <p>Loading...</p>}
        </main>
    );
}
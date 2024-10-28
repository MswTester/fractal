import { Assets, Sprite } from "pixi.js";
import { useRef, useState } from "react";
import Heartsping from "~/entities/heartsping";
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
        const controller = new Controller(new Instance(generateUUID(), [props.user], props.user.id), true);

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
        controller.spawn(myChar);
        controller.bindToCamera(myChar);

        const heart = new Heartsping();
        controller.spawn(heart, 'test', 'webp');

        const gogo = new Sprite(Assets.get("/assets/test/gogoping.webp"))
        gogo.anchor.set(0.5)
        gogo.setSize(100, 100)
        gogo.position.set(0, 0)

        controller.onKeypress("w", () => {
            myChar.move(Math.PI);
        })
        controller.onKeypress("s", () => {
            myChar.move(0);
        })
        controller.onKeypress("a", () => {
            myChar.move(Math.PI*3/2);
        })
        controller.onKeypress("d", () => {
            myChar.move(Math.PI/2);
        })
        controller.onKeypress("ArrowUp", () => {
            controller.cameraPosition.y += 10;
        })
        controller.onKeypress("ArrowDown", () => {
            controller.camera.rotation += 0.1;
        })

        controller.addResizeEvent(window)
        controller.addKeydownEvent(document)
        controller.addKeyupEvent(document)
        controller.addButtondownEvent(document)
        controller.addButtonupEvent(document)
        controller.addMousemoveEvent(document)
        return () => {
            controller.destroy();
            controller.removeResizeEvent(window)
            controller.removeKeydownEvent(document)
            controller.removeKeyupEvent(document)
            controller.removeButtondownEvent(document)
            controller.removeButtonupEvent(document)
            controller.removeMousemoveEvent(document)
        }
    })

    return (
        <main ref={appRef}>
            {assetsLoaded ? null : <p>Loading...</p>}
        </main>
    );
}
import { Assets, Sprite } from "pixi.js";
import { useRef, useState } from "react";
import "~/entities/gogoping";
import "~/entities/heartsping";
import Player from "~/entities/player";
import Romi from "~/entities/romi";
import Entity from "~/entity";
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
        ])
        appRef.current?.appendChild(controller.app.canvas)
        setAssetsLoaded(true)
        const myChar = new Player();
        myChar.equip(props.user.equipments);
        controller.spawn(myChar);
        controller.bindToCamera(myChar);

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

        controller.onButtondown(0, p => {
            const h = Entity.create('heartsping')
            h.position = p;
            controller.spawn(h, 'test', 'webp');
        })
        controller.onButtondown(2, p => {
            const g = new Romi();
            g.position = p;
            controller.spawn(g, 'test', 'png');
        })

        function preventDefault(e: Event){e.preventDefault()}
        window.addEventListener('contextmenu', preventDefault)
        controller.addResizeEvent(window)
        controller.addKeydownEvent(document)
        controller.addKeyupEvent(document)
        controller.addButtondownEvent()
        controller.addButtonupEvent()
        controller.addMousemoveEvent()
        return () => {
            controller.destroy();
            window.removeEventListener('contextmenu', preventDefault)
            controller.removeResizeEvent(window)
            controller.removeKeydownEvent(document)
            controller.removeKeyupEvent(document)
            controller.removeButtondownEvent()
            controller.removeButtonupEvent()
            controller.removeMousemoveEvent()
        }
    })

    return (
        <main ref={appRef}>
            {assetsLoaded ? null : <p>Loading...</p>}
        </main>
    );
}
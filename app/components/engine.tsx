import { GodrayFilter, ShockwaveFilter } from "pixi-filters";
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
        appRef.current?.appendChild(controller.app.canvas)
        setAssetsLoaded(true)
        const myChar = new Player(props.user.id);
        myChar.equip(props.user.equipments);
        controller.spawn(myChar.id, myChar);
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
            // controller.applyFilter(new GodrayFilter({
            //     gain: 0.5,
            //     lacunarity: 2.5,
            //     alpha: 0.8,
            //     parallel: true,
            //     angle: 30
            // }))
        })
        controller.onButtondown(2, p => {
            // controller.applyFilter(new ShockwaveFilter({
            //     speed: 500,
            //     amplitude: 50,
            //     wavelength: 100,
            //     brightness: 1,
            //     radius: 2000,
            //     center: p
            // }))
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
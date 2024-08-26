import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useCompset } from "~/utils/compset";
import Lobby from "./lobby/lobby";
import Navbar from "./navbar";
import Room from "./room/room";
import Social from "./social";
import { useOnce } from "~/utils/hooks";

export default function Home(props:{
    socket: Socket
}) {
    const {patch, isFetching, addAlert, addError, lng} = useCompset()
    const homeState:string = useSelector((state:any) => state.homeState);
    const room:IRoom = useSelector((state:any) => state.room);
    const [onSocial, setOnSocial] = useState<boolean>(false);

    useEffect(() => {
        const keydown = (e:KeyboardEvent) => {
            if(e.key == 'Tab') {
                e.preventDefault();
                setOnSocial((v) => !v);
            }
        }
        window.addEventListener('keydown', keydown)
        return () => {
            window.removeEventListener('keydown', keydown)
        }
    }, [onSocial])

    return <main className="flex flex-col w-full h-full justify-center items-center overflow-hidden">
        <div className="w-full h-full pointer-events-none"
        style={{
            backgroundImage: 'url(bg/default.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)'
        }}></div>
        <div className="flex flex-col w-full h-full justify-center items-center overflow-hidden absolute left-0 top-0">
        {room ? <Room socket={props.socket} /> : <>
                <Navbar />
                {
                    homeState === 'lobby' ? <Lobby socket={props.socket} /> :
                    <></>
                }
            </>
        }
        </div>
        {onSocial && <Social socket={props.socket} close={() => setOnSocial(false)} />}
    </main>
}
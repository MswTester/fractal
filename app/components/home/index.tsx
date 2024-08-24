import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useCompset } from "~/utils/compset";
import Lobby from "./lobby/lobby";
import Navbar from "./navbar";

export default function Home(props:{
    socket: Socket
}) {
    const {patch, isFetching, addAlert, addError, lng} = useCompset()
    const homeState:string = useSelector((state:any) => state.homeState);
    const room:IRoom = useSelector((state:any) => state.room);

    return <main className="flex flex-col w-full h-full justify-center items-center overflow-hidden">
        <div className="w-full h-full pointer-events-none"
        style={{
            backgroundImage: 'url(bg/default.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)'
        }}></div>
        {room ? <div className="flex flex-col w-full h-full justify-center items-center overflow-hidden absolute left-0 top-0">
            
        </div> :
        <div className="flex flex-col w-full h-full justify-center items-center overflow-hidden absolute left-0 top-0">
            <Navbar />
            {homeState === 'lobby' ? <Lobby socket={props.socket} /> : <></>}
        </div>}
    </main>
}
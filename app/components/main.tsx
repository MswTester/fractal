import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Alerts from "./sub/alert";
import Errors from "./sub/error";
import { useInterval } from "usehooks-ts";
import Login from "./login";
import { useCompset } from "~/utils/compset";
import Home from "./home";

export const isDev:boolean = process.env.NODE_ENV === 'development'
const url = isDev ? 'http://127.0.0.1:3000' : 'https://fractal.onrender.com/'

export default function Main() {
    const {patch, useOnce, isFetching, addAlert, addError, lng} = useCompset()
    const alerts:IMessage[] = useSelector((state:any) => state.alerts);
    const errors:IMessage[] = useSelector((state:any) => state.errors);
    const state:string = useSelector((state:any) => state.state);
    const [socket, setSocket] = useState<Socket|null>(null)
    const [time, setTime] = useState<number>(Date.now())
    useInterval(() => setTime(Date.now()), 1000 / 60)

    useOnce(() => {
        try{
            const sock = io(url)
            sock.on('connect', () => {
                setSocket(sock)
                addAlert('Connected to socket server')
            })
            sock.on('error', (err:string) => {
                addError(err)
            })
            return () => {
                sock.disconnect()
                sock.close()
            }
        } catch(err){
            addError('Failed to connect to socket server')
        }
    })

    return <>{
        socket != null ? (
            state === 'login' ? <Login /> :
            state === 'home' ? <Home socket={socket} /> :
            state === 'play' ? <></> :
            <div className="w-full h-full flex justify-center items-center sm:text-sm md:text-base lg:text-lg">Page not found</div>
        ): <div className="w-full h-full flex justify-end items-end sm:text-sm md:text-base lg:text-lg">Connecting to server...</div>
    }
    <Alerts messages={alerts} />
    <Errors messages={errors} />
    </>
}

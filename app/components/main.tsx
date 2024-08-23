import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Alerts from "./sub/alert";
import Errors from "./sub/error";
import { useInterval } from "usehooks-ts";

export const isDev:boolean = process.env.NODE_ENV === 'development'
const url = isDev ? 'http://127.0.0.1:3000' : 'https://fractal.onrender.com/'

export default function Main() {
    const dispatch = useDispatch()
    const patch = (key:string, value:any) => dispatch({type:key, value})
    const [once, setOnce] = useState<boolean>(false)
    const state:string = useSelector((state:any) => state.state);
    const errors:IMessage[] = useSelector((state:any) => state.errors);
    const alerts:IMessage[] = useSelector((state:any) => state.alerts);
    const [socket, setSocket] = useState<Socket|null>(null)
    const [time, setTime] = useState<number>(Date.now())
    useInterval(() => setTime(Date.now()), 1000/ 60)

    useEffect(() => setOnce(true), [])
    useEffect(() => {
        if(once){
            try{
                const sock = io(url)
                sock.on('connect', () => {
                    setSocket(sock)
                    patch('alerts', [...alerts, {message: "Connected to socket server", time:Date.now()}])
                })
                sock.on('error', (err:string) => {
                    patch('error', err)
                })
                return () => {
                    sock.disconnect()
                    sock.close()
                }
            } catch(err){
                patch('errors', [...errors, {message: "Failed to connect to socket server", time:Date.now()}])
            }
        }
    }, [once])

    return <>{
        socket != null ? (
            state === 'login' ? <>hi</> :
            state === 'home' ? <></> :
            state === 'play' ? <></> :
            <div className="w-full h-full flex justify-center items-center sm:text-sm md:text-base lg:text-lg">Page not found</div>
        ): <div className="w-full h-full flex justify-end items-end sm:text-sm md:text-base lg:text-lg">Connecting to server...</div>
    }
    <Alerts messages={alerts} />
    <Errors messages={errors} />
    </>
}

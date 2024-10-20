import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Alerts from "./sub/alert";
import Errors from "./sub/error";
import { useInterval } from "usehooks-ts";
import Login from "./login";
import { useCompset } from "~/utils/compset";
import Home from "./home";
import { useOnce } from "~/utils/hooks";

export const isDev:boolean = process.env.NODE_ENV === 'development'
const url = isDev ? 'http://127.0.0.1:8080' : 'https://fractal-d6jf.onrender.com'

export default function Main() {
    const {patch, isFetching, addAlert, addError, lng} = useCompset()
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
            sock.on('disconnect', () => {
                addError('Disconnected from socket server')
            })
            sock.on('reconnect', () => {
                addAlert('Reconnected to socket server')
            })
            sock.on('kick', (reason:string) => {
                localStorage.removeItem('user')
                addError(reason)
                patch('state', 'login')
                patch('user', null)
                patch('room', null)
            })
            const contextMenu = (e:MouseEvent) => {
                e.preventDefault()
            }
            window.addEventListener('contextmenu', contextMenu)
            return () => {
                sock.disconnect()
                sock.close()
                window.removeEventListener('contextmenu', contextMenu)
            }
        } catch(err){
            addError('Failed to connect to socket server')
        }
    })

    return <>{
        socket != null ? (
            state === 'login' ? <Login socket={socket} /> :
            state === 'home' ? <Home socket={socket} /> :
            state === 'play' ? <></> :
            <div className="w-full h-full flex justify-center items-center sm:text-sm md:text-base lg:text-lg">Page not found</div>
        ): <div className="w-full h-full flex justify-end items-end sm:text-sm md:text-base lg:text-lg">Connecting to server...</div>
    }
    <Alerts messages={alerts} />
    <Errors messages={errors} />
    </>
}

import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Socket } from "socket.io-client"
import { useCompset } from "~/utils/compset"
import { useOnce } from "~/utils/hooks"

export default function Social(props:{
    socket: Socket;
    close: () => void;
}) {
    const {patch, isFetching, addAlert, addError, lng} = useCompset()
    const user:IUser = useSelector((state:any) => state.user)

    useOnce(() => {
        props.socket.on('chat', (id:string, chat:string) => {
        })
        return () => {
            props.socket.off('chat')
        }
    })

    return <div className="w-full h-full flex flex-row justify-start items-center overflow-hidden absolute top-0 left-0 bg-black bg-opacity-40" onMouseDown={e => {
        if(e.target == e.currentTarget) props.close()
    }}>
        <div className="h-full w-64 lg:w-80 bg-black bg-opacity-50 border-r border-white"></div>
    </div>
}
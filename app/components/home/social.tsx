import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Socket } from "socket.io-client"
import { useCompset } from "~/utils/compset"
import { useOnce } from "~/utils/hooks"

export default function Social(props:{
    socket: Socket
}) {
    const {patch, isFetching, addAlert, addError, lng} = useCompset()
    const user:IUser = useSelector((state:any) => state.user)
    const friends:IDisplayUser[] = useSelector((state:any) => state.friends)

    const chatRef = useRef<HTMLDivElement>(null)

    useOnce(() => {
        props.socket.on('chat', (id:string, chat:string) => {

        })
        return () => {
            props.socket.off('chat')
        }
    })

    return <div className="w-full h-full flex flex-row justify-between items-center overflow-hidden absolute top-0 left-0 bg-black bg-opacity-40">
    </div>
}
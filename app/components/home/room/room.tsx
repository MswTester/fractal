import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useCompset } from "~/utils/compset";
import PlayerCard from "./playerCard";
import { useEffect, useRef, useState } from "react";
import { useOnce } from "~/utils/hooks";

export default function Room(props:{
    socket: Socket
}) {
    const {patch, isFetching, addAlert, addError, lng} = useCompset()
    const user:IUser = useSelector((state:any) => state.user)
    const room:IRoom = useSelector((state:any) => state.room)

    const [map, setMap] = useState<number>(0)
    const [mode, setMode] = useState<number>(0)
    const [chats, setChats] = useState<string[]>([])
    const [chat, setChat] = useState<string>('')

    const chatRef = useRef<HTMLDivElement>(null)

    const owner:IDisplayUser = room.players.find(v => v.id == room.ownerId) as IDisplayUser;
    const isOwner:boolean = user.id == room.ownerId

    useOnce(() => {
        props.socket.on('roomUpdated', (room:IRoom) => patch('room', room))
        props.socket.on('roomDestroyed', () => patch('room', null))
        props.socket.on('gameStarted', () => {
            patch('state', 'play')
            patch('room', null)
        })
        return () => {
            props.socket.off('roomUpdated')
            props.socket.off('roomDestroyed')
            props.socket.off('gameStarted')
            patch('room', null)
        }
    })

    useEffect(() => {
        setMap(room.map)
        setMode(room.mode)
    }, [room])

    useEffect(() => {
        if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
        props.socket.on('chat', (chat:string) => setChats([...chats, chat]))
        return () => {
            props.socket.off('chat')
        }
    }, [chats])

    return <main className="flex flex-col w-full h-full justify-center items-center overflow-hidden">
        {/* Navbar */}
        <nav className="w-full flex flex-row justify-between items-center sm:p-2 md:p-3 lg:p-4 bg-neutral-900 bg-opacity-30 under">
            <div className="text-lg lg:text-xl">[Lv.{owner.lvl} {owner.username}] {room.name}</div>
            <div>{room.players.length}/{room.maxPlayers}</div>
        </nav>
        {/* Layout */}
        <div className="w-full h-full flex justify-center overflow-hidden">
            {/* Players */}
            <div className="w-full h-full flex justify-around sm:gap-2 md:gap-3 lg:gap-3 sm:p-2 md:p-3 lg:p-4">
                {room.players.map(player => <PlayerCard key={player.id} user={player} />)}
            </div>
            {/* Interactions */}
            <div className="sm:w-64 md:w-72 lg:w-80 h-full flex flex-col justify-center items-center sm:gap-1 md:gap-1.5 lg:gap-2 sm:p-2 md:p-3 lg:p-4 overflow-hidden">
                {/* Chattings */}
                <div className="w-full h-full rounded-md bg-neutral-900 bg-opacity-50 flex flex-col justify-center items-center gap-1 border border-white overflow-hidden">
                    <div ref={chatRef} className="sm:p-1 md:p-1.5 lg:p-2 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col justify-start items-center">
                        {chats.map((chat, index) => <div key={index} className="text-neutral-100 w-full">{chat}</div>)}
                    </div>
                    <input className="w-full p-1 lg:p-1.5" type="text" value={chat} onChange={e => setChat(e.target.value)} placeholder={lng('chat messages')} onKeyDown={e => {
                        if(e.key === 'Enter'){
                            if(chat.trim() === '') return;
                            props.socket.emit('chat', room.id, chat)
                            setChat('')
                        }
                    }} />
                </div>
                {/* Map */}
                <select disabled={!isOwner} className="w-full p-1 lg:p-1.5" value={map.toString()} onChange={e => {
                    setMap(+e.target.value);
                    props.socket.emit('changeMap', room.id, +e.target.value);
                }}>
                    <option value="0">Forest</option>
                    <option value="1">Castle</option>
                    <option value="2">Valley</option>
                </select>
                {/* Mode */}
                <select disabled={!isOwner} className="w-full p-1 lg:p-1.5" value={mode.toString()} onChange={e => {
                    setMode(+e.target.value);
                    props.socket.emit('changeMode', room.id, +e.target.value);
                }}>
                    <option value="0">Normal</option>
                    <option value="1">Hard</option>
                    <option value="2">Hell</option>
                    <option value="3">Nightmare</option>
                </select>
                {/* Buttons */}
                <div className="w-full flex gap-1 lg:gap-1.5">
                    {isOwner && <button onClick={e => {
                        props.socket.emit('startGame', room.id, (err:string) => {
                            if(err) addError(err)
                        })
                    }} className="w-full p-1 lg:p-1.5">{lng('start')}</button>}
                    <button onClick={e => {
                        props.socket.emit('leaveRoom', room.id, (err:string) => {
                            if(err) addError(err)
                            else patch('room', null)
                        })
                    }} className="w-full p-1 lg:p-1.5">{lng('leave')}</button>
                </div>
            </div>
        </div>
    </main>
}
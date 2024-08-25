import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'
import { useCompset } from '~/utils/compset'
import ProfileCard from '../profileCard'
import CharacterView from '../charView'
import RoomCreation from './roomCreation'
import { useOnce } from '~/utils/hooks'

export default function Lobby(props:{
    socket: Socket
}) {
    const {patch, isFetching, addAlert, addError, lng} = useCompset()
    const user:IUser = useSelector((state:any) => state.user)
    const [rooms, setRooms] = useState<IDisplayRoom[]>([])
    const [showRoomCreation, setShowRoomCreation] = useState<boolean>(false)

    useOnce(() => {
        props.socket.on('rooms', (rooms:IDisplayRoom[]) => {setRooms(rooms)})
        props.socket.on('room', (room:IRoom) => {patch('room', room)})
        props.socket.emit('getRooms')
    })

    return <main className='flex flex-row w-full h-full justify-center items-center overflow-hidden'>
        {/* My Profile */}
        <div className='flex flex-col w-full h-full justify-center sm:p-24 md:p-28 lg:p-32'>
            {/* Character Img */}
            <CharacterView className="w-full sm:h-64 md:h-72 lg:h-96" equipments={user.equipments} />
            {/* Profile Card */}
            <ProfileCard user={user} />
        </div>
        {/* Rooms */}
        <div className='w-full h-full sm:p-1 md:p-1.5 lg:p-2 flex flex-col justify-center items-center sm:gap-1 md:gap-1.5 lg:gap-2 overflow-hidden'>
            {/* Room List Card */}
            <div className='flex flex-col rounded-md bg-[#000a] border border-white w-full h-full flex-1 overflow-hidden'>
                {/* Title */}
                <div className='sm:p-2 md:p-3 lg:p-4 text-center under sm:text-base md:text-lg lg:text-xl w-full'>{lng('rooms')}</div>
                {/* Room List */}
                <div className='w-full h-full overflow-x-hiddedn overflow-y-auto flex flex-col items-center'>
                    {rooms.map((room, index) => (
                        <div key={index}
                            className='flex justify-between items-center cursor-pointer select-none w-full under sm:p-1 md:p-1 lg:p-1.5 sm:gap-1 md:gap-1 lg:gap-1.5 hover:bg-[#fff1]'
                            onClick={e => props.socket.emit('joinRoom', room.id, user, (err:string, room:IRoom) => {
                                if(err) addError(err)
                                else patch('room', room)
                            })}
                        >
                            <div className='text-center sm:text-sm md:text-sm lg:text-base text-neutral-300'>[Lv.{room.ownerLvl} {room.ownerName}]</div>
                            <div className='w-48 lg:w-64 text-center sm:text-base lg:text-lg overflow-hidden truncate'>{room.name}</div>
                            <div className='text-center sm:text-base lg:text-lg'>{room.mode}</div>
                            <div className='text-center sm:text-base lg:text-lg'>{room.map}</div>
                            <div className='text-center sm:text-sm md:text-sm lg:text-base'>{room.players}/{room.maxPlayer}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Interactions */}
            <button onClick={e => setShowRoomCreation(true)} className='w-full sm:p-2 md:p-3 lg:p-4'>{lng('create')}</button>
        </div>
        {/* Room Creation */}
        {showRoomCreation && <div className='absolute top-0 left-0 w-full h-full bg-[#000a] bg-opacity-90 flex justify-center items-center' onPointerDown={e => {
            if(e.target === e.currentTarget) setShowRoomCreation(false)
        }}>
            <RoomCreation socket={props.socket} close={() => setShowRoomCreation(false)} />
        </div>}
    </main>
}
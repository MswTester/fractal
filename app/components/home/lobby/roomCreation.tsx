import { useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useCompset } from "~/utils/compset";

export default function RoomCreation(props:{
    socket:Socket;
    close:() => void;
}){
    const {patch, isFetching, addAlert, addError, lng} = useCompset()
    const user:IUser = useSelector((state:any) => state.user);
    const [name, setName] = useState<string>('');
    const [maxPlayers, setMaxPlayers] = useState<number>(2);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    const createRoom = () => {
        if(name.trim() === ''){
            addError(lng('invalid room name'));
            return;
        }
        if(maxPlayers < 2 || maxPlayers > 8){
            addError(lng('invalid max players'));
            return;
        }
        props.socket.emit('createRoom', user, name, maxPlayers, isPrivate, (err:string, room:IRoom) => {
            if(err){
                addError(err);
            }else{
                patch('room', room);
                props.close();
            }
        })
    }

    return <div className="bg-neutral-800 bg-opacity-50 p-2 lg:p-4 rounded-md lg:rounded-lg border border-white">
        <div className="text-neutral-100 text-lg lg:text-xl mb-2 lg:mb-4">{lng('room name')}</div>
        <input
            type="text"
            placeholder={lng('room name')}
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-neutral-700 text-neutral-100 p-1 lg:p-2 border border-white mb-2 lg:mb-4"
        />
        <div className="flex flex-row items-center justify-between mb-2 lg:mb-4 gap-2 lg:gap-4">
            <div className="text-neutral-100 text-lg lg:text-xl">{lng('max players')}</div>
            <input
                type="number"
                value={maxPlayers}
                onChange={e => setMaxPlayers(Math.max(Math.min(parseInt(e.target.value), 8), 2))}
                className="w-12 bg-neutral-700 text-neutral-100 p-1 lg:p-2 border border-white"
            />
        </div>
        <div className="flex flex-row items-center justify-between mb-2 lg:mb-4 gap-2 lg:gap-4">
            <div className="text-neutral-100 text-lg lg:text-xl">{lng('private')}</div>
            <input
                type="checkbox"
                checked={isPrivate}
                onChange={e => setIsPrivate(e.target.checked)}
                className="w-6 h-6"
            />
        </div>
        <button
            onClick={createRoom}
            className="w-full bg-neutral-700 text-neutral-100 p-2 lg:p-3 border border-white"
        >{lng('create')}</button>
    </div>
}
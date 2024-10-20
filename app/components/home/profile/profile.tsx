import { Socket } from "socket.io-client";
import ProfileCard from "../profileCard";
import CharacterView from "../charView";
import { useSelector } from "react-redux";
import { useCompset } from "~/utils/compset";
import Inventory from "./inventory";
import Slot from "./slot";
import { useState } from "react";
import ItemState from "./itemState";
import { useOnce } from "~/utils/hooks";

export default function Profile(props:{
    socket: Socket
}) {
    const {patch, isFetching, addAlert, addError, lng} = useCompset();
    const user:IUser = useSelector((state:any) => state.user)
    const [onItemState, setOnItemState] = useState<string|null>(null);

    useOnce(() => {
        props.socket.on('equipmentsUpdated', (equipments:IEquipment[]) => {
            patch('isFetching', false);
            const modifiedUser = {...user, equipments };
            patch("user", modifiedUser);
            setOnItemState(null);
        })
    });

    return <main className='flex flex-row w-full h-full justify-center items-center overflow-hidden bg-[#0002]'>
        {/* Profile */}
        <div className="flex flex-col w-full h-full justify-center items-center overflow-hidden gap-4 p-4">
            {/* Character Img */}
            <CharacterView className="w-full sm:h-64 md:h-72 lg:h-96" equipments={user.equipments} />
            {/* Equipments Slots */}
            <div className='flex flex-row w-full justify-center gap-4'>
                <Slot size={96} placeholder="assets/slot/head.svg" tag={user.equipments.find(v => v.slot == 64)?.tag} />
                <Slot size={96} placeholder="assets/slot/body.svg" tag={user.equipments.find(v => v.slot == 65)?.tag} />
                <Slot size={96} placeholder="assets/slot/leg.svg" tag={user.equipments.find(v => v.slot == 67)?.tag} />
                <Slot size={96} placeholder="assets/slot/foot.svg" tag={user.equipments.find(v => v.slot == 68)?.tag} />
                <Slot size={96} placeholder="assets/slot/main.svg" tag={user.equipments.find(v => v.slot == 0)?.tag} />
                <Slot size={96} placeholder="assets/slot/sub.svg" tag={user.equipments.find(v => v.slot == 1)?.tag} />
            </div>
            {/* Profile Card */}
            <ProfileCard user={user} />
        </div>
        {/* Inventory */}
        <Inventory socket={props.socket} setItemState={setOnItemState} />
        {/* Item State */}
        {onItemState !== null && <ItemState socket={props.socket} exit={() => setOnItemState(null)} item={user.items.find(i => i.id == onItemState)} />}
    </main>
}
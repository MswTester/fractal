import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import Slot from "./slot";
import { useWindowSize } from "usehooks-ts";


export default function Inventory(props:{
    socket: Socket;
    setItemState: React.Dispatch<React.SetStateAction<string|null>>;
}) {
    const user:IUser = useSelector((state:any) => state.user)
    const slotSize = useWindowSize().width / 10;

    return <main className="w-full h-full p-4">
        <div className="w-full h-full flex justify-center items-center gap-2 p-2 flex-wrap overflow-x-hidden overflow-y-auto border border-white rounded-md bg-[#0005]">
            {user.items.map((item, index) => {
                return <Slot key={index} className="cursor-pointer" tag={item.tag} size={slotSize} onClick={() => {
                    props.setItemState(item.id)
                }} />
            })}
        </div>
    </main>
}
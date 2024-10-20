import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useCompset } from "~/utils/compset";

export default function ItemState(props:{
    exit:() => void;
    item:IItem|undefined;
    socket:Socket;
}){
    const {patch, isFetching, addAlert, addError, lng} = useCompset();
    const user:IUser = useSelector((state:any) => state.user)
    return <div className="w-full h-full absolute top-0 left-0 bg-[#0009] flex justify-center items-center" onMouseDown={e => {
        if(e.target == e.currentTarget) props.exit();
    }}>
        {/* Card */}
        <div className="w-[80%] h-[80%] border border-white rounded-md flex gap-2">
            <div className="flex flex-col flex-1 w-full h-full items-center justify-between p-2 sm:p-1 gap-2 sm:gap-1">
                {/* Img */}
                <img src={`assets/items/${props.item?.tag}.svg`} alt="" className="w-full h-full" />
                {/* Description */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl sm:text-xl w-full text-center">{props.item?.tag}</h1>
                    <p className="text-base sm:text-sm text-wrap">{props.item?.tag}fdsaaaaaaaaa aaaaaaaaaaaaaaaaaaweurvawytaeriontaerioctnyuac gaaaaaaaaaaaaaaaaaaaaaaetoreaynuiotareueahuareovaei iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiih</p>
                </div>
            </div>
            <div className="flex flex-col flex-1 w-full h-full items-center justify-between p-4 sm:p-2 gap-4">
                {/* Stats */}
                <div className="flex flex-col gap-1 items-center justify-center w-full h-full">
                    <div className="flex flex-col items-center w-full gap-1">
                        {/* Numeric Stat */}
                        <div className="flex gap-1 items-center w-full">
                            <p className="text-xl sm:text-base">Attack</p>
                            <p className="text-2xl sm:text-base text-green-400">{props.item?.tag}</p>
                        </div>
                        {/* Bar Stat */}
                        <div className="w-full h-2 bg-[#0005] rounded-md border border-white">
                            <div className="w-[50%] h-full bg-green-400 rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full gap-1">
                        {/* Numeric Stat */}
                        <div className="flex gap-1 items-center w-full">
                            <p className="text-xl sm:text-base">Attack</p>
                            <p className="text-2xl sm:text-base text-green-400">{props.item?.tag}</p>
                        </div>
                        {/* Bar Stat */}
                        <div className="w-full h-2 bg-[#0005] rounded-md border border-white">
                            <div className="w-[50%] h-full bg-green-400 rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full gap-1">
                        {/* Numeric Stat */}
                        <div className="flex gap-1 items-center w-full">
                            <p className="text-xl sm:text-base">Attack</p>
                            <p className="text-2xl sm:text-base text-green-400">{props.item?.tag}</p>
                        </div>
                        {/* Bar Stat */}
                        <div className="w-full h-2 bg-[#0005] rounded-md border border-white">
                            <div className="w-[50%] h-full bg-green-400 rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full gap-1">
                        {/* Numeric Stat */}
                        <div className="flex gap-1 items-center w-full">
                            <p className="text-xl sm:text-base">Attack</p>
                            <p className="text-2xl sm:text-base text-green-400">{props.item?.tag}</p>
                        </div>
                        {/* Bar Stat */}
                        <div className="w-full h-2 bg-[#0005] rounded-md border border-white">
                            <div className="w-[50%] h-full bg-green-400 rounded-md"></div>
                        </div>
                    </div>
                </div>
                {/* Actions */}
                <div className="flex gap-1 items-center justify-center w-full">
                    <button disabled={isFetching} onClick={e => {
                        e.preventDefault();
                        patch('isFetching', true)
                        if(user.equipments.find(e => e.id == props.item?.id)){
                            props.socket.emit("unequipItem", props.item?.id, (err:string) => {
                                patch('isFetching', false)
                                addError(err)
                            });
                        } else {
                            props.socket.emit("equipItem", props.item?.id, 0, (err:string) => {
                                patch('isFetching', false)
                                addError(err)
                            });
                        };
                    }} className="w-full p-1.5 sm:p-1">{
                        user.equipments.find(e => e.id == props.item?.id) ? lng('unequip') : lng('equip')
                    }</button>
                </div>
            </div>
        </div>
    </div>
}
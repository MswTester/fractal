import CharacterView from "../charView";

export default function PlayerCard(props:{
    user:IDisplayUser;
}){
    return <div className="flex-1 w-full h-full rounded-md border border-white bg-neutral-900 bg-opacity-50 p-2 lg:p-3 flex flex-col justify-center items-center">
        <CharacterView className="w-full sm:h-64 md:h-72 lg:h-96" equipments={props.user.equipments} />
        <div className="sm:p-2 md:p-3 lg:p-4 sm:gap-2 md:gap-3 lg:gap-4 w-full flex flex-row justify-center items-center">
            <img src={props.user.avatar || "assets/icons/profile.svg"} alt="" className="sm:w-14 md:w-16 lg:w-18 sm:h-14 md:h-16 lg:h-18 rounded-full border border-white shadow-sm" />
            <div className="text-lg lg:text-xl">[Lv.{props.user.lvl}]</div>
            <div className="text-lg lg:text-xl">{props.user.username}</div>
        </div>
    </div>
}
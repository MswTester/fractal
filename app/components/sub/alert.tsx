import Msgbox from "./msgbox";

export default function Alerts(props:{
    messages:IMessage[];
}) {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none flex flex-col justify-end items-end sm:gap-0.5 gap-1 lg:gap-1.5 sm:p-0.5 p-1 lg:p-1.5">
            {props.messages.map((message:IMessage, index:number) => <Msgbox key={index} message={message} color="#39FA" maxTime={3000} easeTime={500}/>)}
        </div>
    );
}
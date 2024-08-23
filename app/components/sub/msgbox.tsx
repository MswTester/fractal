import { getTimeline } from "~/utils/ease";

export default function Msgbox(props:{
    message:IMessage;
    color:string;
    maxTime:number;
    easeTime:number;
}){
    const time:number = Date.now() - props.message.time;
    const timeline:number = getTimeline(time, props.easeTime, props.easeTime, props.maxTime);
    console.log(timeline);
    return (
        time > props.maxTime ? null :
        <div
            className="bg-neutral-900 bg-opacity-80 text-neutral-100 text-sm lg:text-base p-1 lg:p-2 rounded-md lg:rounded-lg border border-white"
            style={{
                boxShadow:`0 0 10px ${props.color}, inset 0 0 10px ${props.color}`,
                textShadow: `0 0 10px ${props.color}, inset 0 0 10px ${props.color}`,
                transform:`translateX(calc(${timeline * 100}% + ${timeline * 0.5}rem))`,
            }}
        >
            {props.message.message}
        </div>
    );
}
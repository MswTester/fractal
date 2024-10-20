export default function Slot(props:{
    placeholder?:string;
    tag?:string;
    size?:number;
    flex?:number;
    className?:string;
    onClick?:React.MouseEventHandler<HTMLDivElement>;
}){
    const size:React.CSSProperties = {
        width: props.size || "unset",
        height: props.size || "unset",
        flex: props.flex || "unset"
    }
    return <div onClick={props.onClick} className={`w-16 h-16 bg-[#0003] border border-white rounded-md ${props.className || ""}`}
    style={
        props.placeholder ? {
            backgroundImage: `url(${props.placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            ...size
        } : size
    }>
        {props.tag && <img className="w-full h-full" src={`assets/items/${props.tag}.svg`} alt="" />}
    </div>
}
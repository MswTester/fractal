import { useEffect, useRef } from "react";

export default function CharacterView(props:{
    className?:string;
    equipments:IEquipment[];
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvasRef.current == null) return;
        const canvas:HTMLCanvasElement = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if(ctx == null) return;
        const resizeCanvas = () => {
            const {width, height} = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;

            const charHeight = height*0.8;
            const x = (width - (charHeight/2))/2;
            const y = (height - charHeight)/2;
            const char = new Image();
            char.src = 'assets/entities/player.svg';
            char.onload = () => {
                ctx.drawImage(char, x, y, charHeight/2, charHeight);
            }

            props.equipments.forEach((equip, index) => {
                const equipImg = new Image();
                equipImg.src = `assets/items/${equip.tag}.svg`;
                equipImg.onload = () => {
                    ctx.drawImage(equipImg, 0, 0, 0, 0);
                }
            })
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        }
    }, [props.equipments])
    return <canvas className={props.className} ref={canvasRef}></canvas>
}
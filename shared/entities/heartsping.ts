import Entity from "~/entity";

export default class Heartsping extends Entity{
    static tag: string = 'heartsping';
    tag: string = Heartsping.tag;
    maxHealth: number = 100;
    dDamage: number = 10;
    dSpeed: number = 1;
    dFriction: number = 0.3;
    dScale: Point = {x: 1, y: 1};
    dAnchor: Point = {x: 0.5, y: 0.5};
    constructor(){
        super();
    }
    static {Entity.register(Heartsping.tag, Heartsping);}
}

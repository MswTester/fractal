import Entity from "~/entity";
import Item from "~/item";

export default class Player extends Entity{
    static tag: string = 'player';
    tag: string = Player.tag;
    maxHealth: number = 100;
    damage: number = 10;
    speed: number = 5;
    attackable: boolean = true;
    team: string = '';
    headSlot: Item | null = null;
    bodySlot: Item | null = null;
    legsSlot: Item | null = null;
    mainWeapon: Item | null = null;
    subWeapon: Item | null = null;
    constructor(){
        super();
    }
    static {Entity.register(Player.tag, Player);}

    equip(equipments: IEquipment[]){
        equipments.forEach(equipment => {
            switch(equipment.slot){
                case 64:
                    this.headSlot = Item.create(equipment.tag)
                    break;
                case 65:
                    this.bodySlot = Item.create(equipment.tag)
                    break;
                case 66:
                    this.legsSlot = Item.create(equipment.tag)
                    break;
                case 0:
                    this.mainWeapon = Item.create(equipment.tag)
                    break;
                case 1:
                    this.subWeapon = Item.create(equipment.tag)
                    break;
            }
        });
    }
}

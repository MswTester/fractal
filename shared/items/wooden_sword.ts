import Item from "~/item";

export class WoodenSword extends Item{
    static tag: string = 'wooden_sword';
    tag: string = WoodenSword.tag;
    damage: number = 10;
    criticalChance: number = 0.1;
    criticalDamage: number = 2;
    knockback: number = 0.5;
    cooldown: number = 500;
    constructor(){
        super();
    }
    static {Item.register(WoodenSword.tag, WoodenSword);}
    tick(delta: number): void {
        // cooldown
        this.restCooldown -= delta;
        if(this.restCooldown < 0){
            this.restCooldown = 0;
        }
        // main interaction
        if(this.mainDown && this.restCooldown <= 0){
            this.mainInteraction();
            this.restCooldown = this.cooldown;
        }
    }
    mainInteraction(): void {}
}
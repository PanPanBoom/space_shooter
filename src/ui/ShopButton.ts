import { GameObjects, Scene } from "phaser";
import { Item } from "../items/Item";
import { Potion } from "../items/Potion";

export class ShopButton extends GameObjects.Image
{
    private item: Item;

    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y, "sprites", "button_square_depth.png");

        this.setOrigin(0);
        this.setScale(2);

        this.item = new Potion(scene, x + this.displayWidth / 2, y + this.displayHeight / 2).setOrigin(0.5).setTint(0x000000).setScale(2);
        
        console.log(x, this.displayWidth, y, this.displayHeight);
        this.scene.add.existing(this);
        this.scene.add.existing(this.item);
    }
}
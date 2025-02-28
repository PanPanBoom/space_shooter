import { GameObjects, Input, Scene } from "phaser";
import { Item } from "../items/Item";
import { Potion } from "../items/Potion";
// import { ItemDescriptionBox } from "./ItemDescriptionBox";

export class ShopButton extends GameObjects.Image
{
    private item: Item;
    // private descriptionBox: ItemDescriptionBox;
    private hover: boolean;

    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y, "sprites", "button_square_depth.png");

        this.setOrigin(0);
        this.setScale(2);

        this.item = new Potion(scene, x + this.displayWidth / 2, y + this.displayHeight / 2).setOrigin(0.5).setTint(0x000000).setScale(2);
        
        this.scene.add.existing(this);
        this.scene.add.existing(this.item);

        this.setInteractive({
            useHandCursor: true
        });

        this.hover = false;

        // this.descriptionBox = new ItemDescriptionBox(this.scene, 0, 0, this.item.getDescription()).setVisible(false);
        // this.scene.add.existing(this.descriptionBox);

        this.on('pointerover', () => this.hoverBehavior(true));
        
        this.on('pointerout', () => this.hoverBehavior(false));

        this.on('pointerdown', (pointer: Input.Pointer) => {
            if(this.getBounds().contains(pointer.x, pointer. y))
                this.emit("click", this.item);
        })
    }

    private hoverBehavior(hover: boolean)
    {
        this.hover = hover;
        this.setTint(this.hover ? 0x999999 : 0xffffff);
        // this.descriptionBox.setVisible(hover);
    }

    // public preUpdate()
    // {
    //     if(this.hover)
    //         this.descriptionBox.setPosition(Phaser.Math.Clamp(this.scene.input.x, 0, this.scene.cameras.main.width - this.descriptionBox.displayWidth), this.scene.input.y);
    // }
}
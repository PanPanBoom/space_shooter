import { GameObjects, Input, Math, Scene } from "phaser";
import { Item } from "../items/Item";
import { Potion } from "../items/Potion";
import { NewShip } from "../items/NewShip";
// import { ItemDescriptionBox } from "./ItemDescriptionBox";

export class ShopButton extends GameObjects.Container
{
    private bg: GameObjects.Image;
    private item: Item;
    // private descriptionBox: ItemDescriptionBox;
    private hover: boolean;

    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y);

        this.bg = new GameObjects.Image(scene, x, y, "sprites", "button_square_depth.png").setOrigin(0);
        this.add(this.bg);
        this.setSize(this.bg.displayWidth, this.bg.displayHeight);

        this.item = this.selectRandomItem(x + this.displayWidth / 2, y + this.displayHeight / 2).setOrigin(0.5).setTint(0x000000);
        this.add(this.item);

        this.scene.add.existing(this);
        
        this.bg.setInteractive({
            useHandCursor: true
        });

        const priceText = this.add(new GameObjects.Text(this.scene, this.bg.displayWidth / 2, this.bg.displayHeight, this.item.getPrice().toString(), {
            fontSize: '32px',
            fontFamily: 'future',
            align: 'center'
        }).setOrigin(0.5, 0));

        this.add(new GameObjects.Image(this.scene, priceText.displayWidth * 0.7, this.bg.displayHeight, "sprites", "tokens.png").setOrigin(0, 0).setScale(0.5));

        this.hover = false;
        this.setScale(2);

        // this.descriptionBox = new ItemDescriptionBox(this.scene, 0, 0, this.item.getDescription()).setVisible(false);
        // this.scene.add.existing(this.descriptionBox);

        this.bg.on('pointerover', () => this.hoverBehavior(true));
        
        this.bg.on('pointerout', () => this.hoverBehavior(false));

        this.bg.on('pointerdown', (pointer: Input.Pointer) => {
            console.log(pointer.x, pointer.y);
            this.emit("click", this.item);
        })
    }

    private selectRandomItem(x: number, y: number): Item
    {
        const items = [new Potion(this.scene, x, y), new NewShip(this.scene, x, y, 2)];

        return items[Math.Between(0, items.length - 1)];
    }

    private hoverBehavior(hover: boolean)
    {
        this.hover = hover;
        this.bg.setTint(this.hover ? 0x999999 : 0xffffff);
        // this.descriptionBox.setVisible(hover);
    }

    public getItem()
    {
        return this.item;
    }

    // public preUpdate()
    // {
    //     if(this.hover)
    //         this.descriptionBox.setPosition(Phaser.Math.Clamp(this.scene.input.x, 0, this.scene.cameras.main.width - this.descriptionBox.displayWidth), this.scene.input.y);
    // }
}
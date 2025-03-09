import { GameObjects, Scene } from "phaser";

export class ItemDescriptionBox extends GameObjects.Container
{
    private descriptionBackground: GameObjects.Rectangle;
    private descriptionText: GameObjects.Text;

    constructor(scene: Scene, x: number, y: number, description: string)
    {
        super(scene, x, y);

        this.descriptionText = this.scene.add.text(0, 0, description, {
            fontFamily: 'future',
            fontSize: '34px',
            align: 'center',
            wordWrap: {
                width: this.displayWidth
            }
        });

        const padding = 30;
        this.descriptionBackground = this.scene.add.rectangle(this.descriptionText.x + this.descriptionText.displayWidth / 2, this.descriptionText.y + this.descriptionText.displayHeight / 2, this.descriptionText.getBounds().width + padding, this.descriptionText.getBounds().height + padding, 0x333333);
        this.descriptionBackground.setStrokeStyle(2, 0xffffff);

        this.add(this.descriptionBackground);
        this.add(this.descriptionText);

        this.setDepth(2);
    }

    public getWidth(): number
    {
        return this.descriptionBackground.displayWidth;
    }

    // public setPosition(x?: number, y?: number, z?: number, w?: number): this {
    //     super.setPosition(x, y);
    //     this.descriptionText.setPosition(x, y);

    //     return this;
    // }
}
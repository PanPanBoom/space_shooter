import { GameObjects, Scene } from "phaser";

export abstract class BaseScene extends Scene
{
    private bg: GameObjects.TileSprite;

    constructor(config: string)
    {
        super(config);
    }

    preload()
    {
        this.load.setPath('assets');
        
        this.load.image('bg', 'Backgrounds/blue.png');
    }

    create(data?: Object)
    {
        this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "bg").setOrigin(0).setTileScale(2);
    }

    update(time: number, delta: number)
    {
        this.bg.tilePositionY -= 0.1 * delta;
    }
}